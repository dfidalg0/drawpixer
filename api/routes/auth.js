// Roteamento do express
import { Router } from 'express';

// Hash de senha
import bcrypt from 'bcrypt';

// Funções auxiliares
import pick from 'lodash.pick';
import { ObjectID } from 'mongodb';
import { isEmail } from 'validator';

// Intermediários de autenticação/comunicação com banco de dados
import * as google from '../lib/google';
import * as mongo from '../lib/mongo';
import * as jwt from '../lib/jwt';

// Função auxiliar para envio de tokens
function sendTokens(res, accessToken, refreshToken){
    // Refresh token salvo no cookie jid, enviado apenas a partir da rota
    // /api/jwt
    res.cookie('jid', refreshToken, {
        maxAge: 30 * 24 * 3600, // 30 dias
        httpOnly: true,
        sameSite: true,
        path: '/api/jwt',
        secure: process.env.NODE_ENV === 'production'
    });
    // Token de acesso enviado através do corpo da resposta
    return res.json({
        token: accessToken
    });
}

const routes = Router();

// Rota de login convencional
routes.post('/login', async (req, res) => {
    // Obtenção de dados do formulário
    let { email, password } = req.body;

    // Validação dos dados para evitar injeção de queries no MongoDB
    if (typeof email !== 'string'){
        email = JSON.stringify(email);
    }

    if (typeof password !== 'string'){
        password = JSON.stringify(password) || '';
    }

    try {
        const db = await mongo.getDb();

        // Busca do usuário no banco de dados
        const user = await db.collection('users').findOne({ email }) || {};

        // Comparação da senha fornecida com o hash da senha armazenado no banco
        const same = await bcrypt.compare(password, user.password || '');

        // Obs.: '' nunca será o hash calculado de nada, logo
        // bcrypt.compare(<qualquer coisa>, '') será false

        // same será true apenas se o usuário for encontrado no banco de dados
        // E, além disso, a senha digitada corresponder à original
        if (same){
            // Geração dos tokens
            const [refreshToken, accessToken] = await Promise.all([
                jwt.genRefreshToken(),
                jwt.sign(
                    user._id.toString(), pick(user, ['name', 'email'])
                )
            ]);

            // Adição do refresh token ao banco de dados (para controle)
            await db.collection('tokens').insertOne({
                key: refreshToken, sub: user._id,
                created_at: new Date()
            });

            // Envio dos tokens
            return sendTokens(res, accessToken, refreshToken);
        }
        else {
            // Email ou senha digitados incorretamente
            return res.status(401).json({
                message: 'Email ou senha inválidos'
            });
        }
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});

// Rota para cadastro convencional
routes.post('/register', async (req, res) => {
    // Obtenção de dados de formulário
    const { name, email, password, passConfirm} = req.body;

    // Validação dos dados
    if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        password !== passConfirm ||
        name.length < 5 ||
        password.length < 8 ||
        !isEmail(email)
    ){
        return res.status(422).json({
            message: 'Formulário inválido'
        });
    }

    try {
        const session = await mongo.getSession();
        const db = await mongo.getDb();

        // Cálculo do hash da senha para inserção no banco de dados
        const hashedPass = await bcrypt.hash(password, 12);

        let accessToken, refreshToken;

        // Flag de existência
        let alreadyExists = false;

        // Transação no banco para cadastro
        await session.withTransaction(async () => {
            // Busca por usuário pelo email (e inserção caso não exista)
            const { upsertedId } = await db.collection('users').updateOne(
                { email },
                { $setOnInsert: { name, email, password: hashedPass } },
                { session, returnOriginal: false, upsert: true }
            );

            // Se não ocorreu upsert, o usuário já existia
            if (!upsertedId){
                await session.abortTransaction();
                return alreadyExists = true;
            }

            // Extração do id do usuário
            const { _id } = upsertedId;

            // Geração dos tokens
            [refreshToken, accessToken] = await Promise.all([
                jwt.genRefreshToken(),
                jwt.sign(
                    _id.toString(), { name, email }
                )
            ]);

            // Adição do refresh token ao banco de dados
            await db.collection('tokens').insertOne({
                key: refreshToken, sub: _id,
                created_at: new Date()
            }, { session });
        });

        session.endSession();

        if (alreadyExists){
            return res.status(409).json({
                message: 'Usuário já existente'
            });
        }
        else return sendTokens(res, accessToken, refreshToken);
    }
    catch(err){
        console.error(err.message);
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});

// Rota para cadastro e login com Google
routes.post('/login/google', async (req, res) => {
    // Obtenção do token de login do Google
    const { idToken } = req.body;

    const client = google.getClient();

    try {
        // Verificação do id do token do Google
        const ticket = await client.verifyIdToken({ idToken });

        const payload = ticket.getPayload();

        // Extração das informações do usuário
        const { sub, email, given_name, family_name } = payload;

        const session = await mongo.getSession();
        const db = await mongo.getDb();

        let refreshToken, accessToken;

        // Flag de verificação de existência por cadastro convencional
        let alreadyExists = false;

        // Transação de Cadastro/Login
        await session.withTransaction(async () => {
            // Busca do usuário pelo email
            // Se não existir, será criado um com estas características (upsert)
            const result = await db.collection('users').findOneAndUpdate(
                { email },
                { $setOnInsert: { google_id: sub, name: `${given_name} ${family_name}` } },
                { upsert: true , session, returnOriginal: false }
            );

            // Obtenção do usuário
            const user = result.value;

            // Caso o id do Google do usuário obtido seja diferente do fornecido no ticket, então
            // a) O usuário está cadastrado por login convencional
            // b) O Google tem sérios problemas de autenticação (acredito não ser o caso)
            if (user.google_id !== sub){
                await session.abortTransaction();
                return alreadyExists = true;
            }

            // Geração dos tokens
            [refreshToken, accessToken] = await Promise.all([
                jwt.genRefreshToken(),
                jwt.sign(
                    user._id.toString(), pick(user, ['name', 'email'])
                )
            ]);

            // Inserção do refresh token no banco de dados
            await db.collection('tokens').insertOne({
                key: refreshToken, sub: user._id,
                created_at: new Date()
            }, { session });
        });

        session.endSession();

        if (alreadyExists){
            return res.status(409).json({
                message: 'Já existe um usuário com esse email não vinculado a esta conta do Google'
            });
        }
        else return sendTokens(res, accessToken, refreshToken);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});

// Rotação do token de acesso (JWT)
routes.post('/jwt/refresh', async (req, res) => {
    // Obtenção do token de acesso atual
    const { token } = req.body;

    try {
        const db = await mongo.getDb();

        // Extração das informações e verificação do token
        // * sub -> Subject
        // * exp -> Data de expiração
        // * iat -> Data de emissão
        const { sub, exp, iat, ...payload } = await jwt.verify(token);

        // Obtenção do refresh token
        const { jid: key } = req.cookies;

        // Geração do novo refresh token
        const refreshToken = await jwt.genRefreshToken();

        // Busca e atualização do refresh token no banco de dados
        const update = await db.collection('tokens').updateOne({
            sub: new ObjectID(sub), key
        }, {
            $set: {
                key: refreshToken,
                created_at: new Date()
            }
        });

        // Se o refresh token foi encontrado, o usuário tem a permissão
        // para obter um novo JWT
        if (update.matchedCount){
            const accessToken = await jwt.sign(sub, payload);

            // Envio dos novos tokens gerados
            return sendTokens(res, accessToken, refreshToken);
        }
        // Caso contrário, a comunicação é forjada (o refresh token é inválido)
        else {
            return res.status(401).json({
                message: 'Credenciais inválidas'
            });
        }
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});

// Criação de um JWT a partir de um refresh token
routes.post('/jwt/create', async (req, res) => {
    // Extração do refresh token da requisição
    const { jid: key } = req.cookies;

    if (!key){
        return res.json({
            token: null
        });
    }

    try {
        const db = await mongo.getDb();

        // Busca do usuário no banco de dados através de uma pipeline de agregação
        const [user] = await db.collection('tokens').aggregate([
            // Primeiro estágio: busca do refresh token fornecido
            { $match: { key } },
            // Segundo estágio: JOIN com a coleção de usuários
            {
                $lookup: {
                    from: 'users',
                    localField: 'sub',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            // Terceiro estágio: Remoção do Array de usuários (apenas um será encontrado de qualquer forma)
            {
                $project: {
                    user: {
                        $arrayElemAt: [ '$user', 0 ]
                    }
                }
            },
            // Remoção das informações desnecessárias
            { $replaceRoot: { newRoot: '$user' } }
        ]).toArray();

        // Usuário encontrado
        if (user){
            // Extração das informações do usuário
            const { _id, google_id, ...payload } = user;
            const sub = _id.toString();

            // Geração dos tokens
            const accessToken = await jwt.sign(sub, payload);
            const refreshToken = key;

            // Envio dos tokens
            return sendTokens(res, accessToken, refreshToken);
        }
        // Usuário não encontrado (refresh token inválido)
        else {
            return res.status(401).json({
                message: 'Credenciais inválidas'
            });
        }
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});

// Rota para logout (destruição do refresh token no banco)
routes.post('/jwt/destroy', async (req, res) => {
    // Obtenção dos tokens da requisição
    const { jid: key } = req.cookies;
    const { token } = req.body;

    if (key){
        try {
            // Verificação do JWT
            const { sub } = await jwt.verify(token);

            const db = await mongo.getDb();

            // Deleção do refresh token do banco de dados
            const deletion = await db.collection('tokens').deleteOne({
                key, sub: new ObjectID(sub)
            });

            if (deletion.result.ok){
                // Limpeza do refresh token dos cookies do usuário
                res.clearCookie('jid', { path: '/api/jwt' });

                // Limpeza do access token do usuário
                return res.json({
                    token: null
                });
            }
            else {
                return res.status(500).json({
                    message: 'Erro interno do servidor'
                });
            }
        }
        catch(err){
            console.error(err);
            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }
    // Na ausência do refresh token, o usuário não está devidamente autenticado
    else {
        return res.status(400).json({
            message: 'Usuário não autenticado'
        });
    }
});

export default routes;
