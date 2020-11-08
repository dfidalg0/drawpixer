import { Router } from 'express';
import pick from 'lodash.pick';
import { ObjectID } from 'mongodb';

import * as google from '../lib/google';
import * as mongo from '../lib/mongo';
import * as jwt from '../lib/jwt';

function sendTokens(res, accessToken, refreshToken){
    res.cookie('jid', refreshToken, {
        maxAge: 30 * 24 * 3600, // 30 dias
        httpOnly: true,
        sameSite: true,
        path: '/api/jwt',
        secure: process.env.NODE_ENV === 'production'
    });
    return res.json({
        token: accessToken
    });
}

const routes = Router();

routes.post('/login', async (req, res) => {
    const { idToken } = req.body;

    const client = google.getClient();

    try {
        const ticket = await client.verifyIdToken({ idToken });

        const payload = ticket.getPayload();

        const { sub, email, given_name, family_name } = payload;

        const query = {
            google_id: sub
        }

        const session = await mongo.getSession();
        const db = await mongo.getDb();

        let user, refreshToken, accessToken;

        await session.withTransaction(async () => {
            const result = await db.collection('users').findOneAndUpdate(
                query,
                { $setOnInsert: { email, name: `${given_name} ${family_name}` } },
                { upsert: true , session, returnOriginal: false }
            );

            user = result.value;

            [refreshToken, accessToken] = await Promise.all([
                jwt.genRefreshToken(),
                jwt.sign(
                    user._id.toString(), pick(user, ['name', 'email'])
                )
            ]);

            await db.collection('tokens').insertOne({
                key: refreshToken, sub: user._id,
                created_at: new Date()
            });
        });

        return sendTokens(res, accessToken, refreshToken);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});

routes.post('/jwt/refresh', async (req, res) => {
    const { token } = req.body;

    try {
        const db = await mongo.getDb();

        const { sub, exp, iat, ...payload } = await jwt.verify(token);

        const { jid: key } = req.cookies;

        const refreshToken = await jwt.genRefreshToken();

        const update = await db.collection('tokens').updateOne({
            sub: new ObjectID(sub), key
        }, {
            $set: {
                key: refreshToken,
                created_at: new Date()
            }
        });

        if (update.matchedCount){
            const accessToken = await jwt.sign(sub, payload);

            return sendTokens(res, accessToken, refreshToken);
        }
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

routes.post('/jwt/create', async (req, res) => {
    const { jid: key } = req.cookies;

    if (!key){
        return res.json({
            token: null
        });
    }

    try {
        const db = await mongo.getDb();

        const [user] = await db.collection('tokens').aggregate([
            { $match: { key } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sub',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    user: {
                        $arrayElemAt: [ '$user', 0 ]
                    }
                }
            },
            { $replaceRoot: { newRoot: '$user' } }
        ]).toArray();

        if (user){
            const { _id, google_id, ...payload } = user;
            const sub = _id.toString();

            const accessToken = await jwt.sign(sub, payload);
            const refreshToken = key;

            return sendTokens(res, accessToken, refreshToken);
        }
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

routes.post('/jwt/destroy', async (req, res) => {
    const { jid: key } = req.cookies;
    const { token } = req.body;

    if (key){
        try {
            const { sub } = await jwt.verify(token);

            const db = await mongo.getDb();
            const deletion = await db.collection('tokens').deleteOne({
                key, sub: new ObjectID(sub)
            });

            if (deletion.result.ok){
                res.clearCookie('jid', { path: '/api/jwt' });

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
});

export default routes;
