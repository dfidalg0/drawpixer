import { Router } from 'express'
import { authenticate } from '../middlewares/auth'

import * as mongo from '../lib/mongo';

const routes = Router();
routes.use(authenticate());

// rota para salvar desenho no banco de dados
// deve receber o título do desenho e 
// estrutura com informações do grid (dimensões e cores)
// no corpo da requisição

routes.post('/saveDrawing', async (req, res) => {
    const id = req.user._id;
    const title = req.body.title;
    const grid = req.body.grid;

    try {
        // Flag de existência
        let alreadyExists = false;

        const session = await mongo.getSession();
        const db = await mongo.getDb();

        // Transação no banco para desenho
        await session.withTransaction(async () => {

            // Busca por id de usuário e titulo do desenho (e insere caso não exista)
            const { upsertedId } = await db.collection('drawings').updateOne(
                { id, title },
                { $setOnInsert: { id, title, grid } },
                { session, returnOriginal: false, upsert: true }
            );

            // Se não ocorreu upsert, já existia um desenho deste usuário com este título.
            if (!upsertedId) {
                await session.abortTransaction();
                return alreadyExists = true;
            }
        });

        session.endSession();

        if (alreadyExists) {
            return res.status(409).json({
                message: 'Desenho{ drawings }com este título já existe!'
            });
        }
        else {
            return res.status(200).json({
                message: 'Desenho cadastrado com sucesso!'
            })
        }
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});

// rota para retornar todos os desenhos do usuário logado
routes.get('/getUserDrawings', async (req, res) => {

    const id = req.user._id;

    try {
        const db = await mongo.getDb();

        // Busca dos desenhos no banco de dados
        const drawings = await db.collection('drawings').find({ id }).toArray() || {};
        return res.status(200).json({
            drawings
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});


export default routes;