import { Router } from 'express';
import getDb from './lib/mongo';

const routes = Router();

routes.get('/create', async (req, res) => {
    const db = await getDb();

    const message = req.query.message || 'hello';
    const date = new Date();

    const document = { message, date };

    try {
        const { result } = await db.collection('hello').insertOne(document);

        if (result.ok){
            return res.json({
                inserted: true,
                document
            });
        }
        else {
            return res.json({
                inserted: false,
                message: 'Error on database'
            });
        }
    }
    catch (err){
        return res.json({
            inserted: false,
            message: 'Internal Server Error'
        });
    }
});

export default routes;
