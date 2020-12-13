import { Router } from 'express'
import { authenticate } from '../middlewares/auth'

import * as mongo from '../utils/mongo';

import pick from 'lodash.pick';

import { ObjectID } from 'mongodb';

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

    if (typeof title !== 'string') {
        errors.push('title');
    }

    if (typeof grid.x !== 'number' || grid.x <= 0) {
        errors.push('grid.x');
    }

    if (typeof grid.y !== 'number' || grid.y <= 0) {
        errors.push('grid.y');
    }

    if (!(
        grid.colors instanceof Array &&
        grid.colors.length === grid.x * grid.y &&
        grid.colors.every(color => color.match(/#[a-f0-9]{6}/))
    )) {
        errors.push('grid.colors');
    }

    if (errors.length) {
        return res.status(422).json({
            message: 'Formulário inválido',
            fields: errors
        });
    }

    try {
        const db = await mongo.getDb();

        const { insertedId } = await db.collection('drawings').insertOne(
            { title, grid, user, likes: [], num_likes: 0 }
        );

        return res.json({
            _id: insertedId,
            created_at: insertedId.getTimestamp(),
            message: 'Pixer salvo com sucesso'
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

// rota para carregar os desenhos da comunidade
// carrega de min+1 até min+11
routes.get('/drawings/community/:min', async (req, res) => {
    const user_id = req.user._id;
    const min = Number(req.params.min);
    try {
        const db = await mongo.getDb();

        // Busca dos desenhos no banco de dados
        var drawings = await db.collection('drawings').find().sort({ num_likes: -1 }).skip(min).limit(10).toArray();

        for (var i = 0; i < drawings.length; i++) {
            var l = false;
            var draw = drawings[i]
            for (var j = 0; j < draw.likes.length; j++) {
                if (String(draw.likes[j]) === String(user_id)) {
                    l = true;
                    break;
                }
            }
            drawings[i].likes = l;
        }
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

// rota para deletar desenho do usuário
routes.delete('/drawing/delete/:id', async (req, res) => {
    const draw_id = req.params.id;
    const user_id = req.user._id;

    if (!ObjectID.isValid(draw_id)){
        return res.status(422).json({
            message: 'ID de desenho inválido'
        })
    }

    try {
        const db = await mongo.getDb();

        const { deletedCount } = await db.collection('drawings').deleteOne(
            {
                "_id": new ObjectID(draw_id),
                'user._id': user_id
            }
        );
        if (deletedCount === 0) {
            return res.status(404).json({
                message: 'Desenho não encontrado!'
            });
        } else {
            return res.status(200).json({
                message: 'Desenho deletado com sucesso!'
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

routes.post('/drawings/update', async (req, res) => {
    const user = pick(req.user, ['_id', 'name']);
    const { id, grid } = req.body;

    const errors = [];

    if (!ObjectID.isValid(id)){
        errors.push('id');
    }

    if (typeof grid.x !== 'number' || grid.x <= 0) {
        errors.push('grid.x');
    }

    if (typeof grid.y !== 'number' || grid.y <= 0) {
        errors.push('grid.y');
    }

    if (!(
        grid.colors instanceof Array &&
        grid.colors.length === grid.x * grid.y &&
        grid.colors.every(color => color.match(/#[a-f0-9]{6}/))
    )) {
        errors.push('grid.colors');
    }

    if (errors.length) {
        return res.status(422).json({
            message: 'Formulário inválido',
            fields: errors
        });
    }

    try {
        const db = await mongo.getDb();


        const { modifiedCount } = await db.collection('drawings').updateOne(
            { "_id": new ObjectID(id), user },
            { $set: { grid: grid } }
        );

        if (modifiedCount === 0) {
            return res.status(404).json({
                message: 'Desenho não encontrado!'
            });
        } else {
            return res.status(200).json({
                message: 'Alterado com sucesso!'
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


routes.post('/drawings/update/likes', async (req, res) => {
    const user = pick(req.user, ['_id', 'name']);
    const { id } = req.body;
    if (!ObjectID.isValid(id)){
        return res.status(422).json({
            message: 'Formulário Inválido'
        });
    }

    try {
        const db = await mongo.getDb();


        const { modifiedCount } = await db.collection('drawings').updateOne(
            { "_id": new ObjectID(id) },
            {
                $addToSet: { likes: String(user._id) },
                $inc: { "num_likes": 1 }
            }
        );

        if (modifiedCount === 0) {
            return res.status(404).json({
                message: 'Usuário já havia dado like'
            });
        } else {
            return res.status(200).json({
                message: 'Curtido com sucesso!'
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

routes.post('/drawings/update/likes/remove', async (req, res) => {
    const user = pick(req.user, ['_id', 'name']);
    const { id } = req.body;


    if (!ObjectID.isValid(id)){
        return res.status(422).json({
            message: 'ID de desenho inválido'
        });
    }

    try {
        const db = await mongo.getDb();


        const { modifiedCount } = await db.collection('drawings').updateOne(
            { "_id": new ObjectID(id) },
            {
                $pull: { likes: String(user._id) },
                $inc: { "num_likes": -1 }
            }
        );

        if (modifiedCount === 0) {
            return res.status(404).json({
                message: 'Usuário não havia dado like'
            });
        } else {
            return res.status(200).json({
                message: 'Descurtido com sucesso!'
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
export default routes;
