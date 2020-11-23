import { Router } from 'express'
import { authenticate } from '../middlewares/auth'

import * as mongo from '../utils/mongo';

import pick from 'lodash.pick';

const routes = Router();
routes.use(authenticate());

// rota para salvar desenho no banco de dados
// deve receber o título do desenho e
// estrutura com informações do grid (dimensões e cores)
// no corpo da requisição

routes.post('/drawings/create', async (req, res) => {
    const user = pick(req.user, ['_id', 'name']);
    const { title, grid } = req.body;

    const errors = [];

    if (typeof title !== 'string'){
        errors.push('title');
    }

    if (typeof grid.x !== 'number' || grid.x <= 0){
        errors.push('grid.x');
    }

    if (typeof grid.y !== 'number' || grid.y <= 0){
        errors.push('grid.y');
    }

    if (!(
        grid.colors instanceof Array &&
        grid.colors.length === grid.x * grid.y &&
        grid.colors.every(color => color.match(/#[a-f0-9]{6}/))
    )) {
        errors.push('grid.colors');
    }

    if (errors.length){
        return res.status(422).json({
            message: 'Formulário inválido',
            fields: errors
        });
    }

    try {
        const db = await mongo.getDb();

        // Busca por id de usuário e titulo do desenho (e insere caso não exista)
        const { insertedId } = await db.collection('drawings').insertOne(
            { title, grid, user }
        );

        return res.json({
            _id: insertedId,
            created_at: insertedId.getTimestamp()
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});

// rota para retornar todos os desenhos do usuário logado
routes.get('/drawings/mine', async (req, res) => {
    const user_id = req.user._id;

    try {
        const db = await mongo.getDb();

        // Busca dos desenhos no banco de dados
        const drawings = await db.collection('drawings').find({
            'user._id': user_id
        }).toArray();

        return res.json(drawings.map(draw => (
            { ...draw, created_at: draw._id.getTimestamp() }
        )));
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
});


export default routes;
