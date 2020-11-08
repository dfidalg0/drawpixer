// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express';
import * as jwt from '../lib/jwt';

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const verifyMiddleware = async (req, res, next) => {
    const token = req.header('authorization');

    try {
        const { sub, exp, iat, ...payload } = await jwt.verify(token);

        req.user = {
            _id: sub,
            ...payload
        };

        return next();
    }
    catch (err){
        return res.status(401).json({
            message: 'Credenciais inválidas'
        });
    }
};

/**
 * Middleware para verificar que um usuário está devidamente autenticado
 * @description Invalida o pedido caso este não possua um token de autorização
 * válido e encaminha para a próxima etapa caso contrário
 * @example
 * app.use('/private', authenticate());
 * app.get('/private/route', (req, res) => {
 *     // Será executado apenas se o usuário for validado anteriormente
 * });
 * @example
 * app.get('/api/secret', authenticate(), (req, res) => {
 *     // Será executado apenas se o usuário for validado anteriormente
 * });
 */
export const authenticate = () => verifyMiddleware;
