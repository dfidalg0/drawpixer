import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

const secret = process.env.JWT_SECRET;

/**
 * @description
 * Assina um JWT para ser utilizado na autenticação
 * @returns {Promise<string>} JWT assinado
 * @param {string} subject ID do usuário para quem o JWT será assinado
 * @param {any} payload Conteúdo do JWT assinado
 */
export function sign(subject, payload){
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, {
            subject,
            expiresIn: 15 * 60 // 15 minutos
        }, (err, encoded) => {
            if (err) reject(err);
            else resolve(encoded);
        });
    });
}

/**
 * @description
 * Verifica se um JWT é valido e devolve o seu conteúdo
 * @param {string} token JWT a ser verificado
 * @returns {Promise<any>} Payload do JWT decodificado
 */
export function verify(token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
}

/**
 * @description
 * Gera uma string aleatória grande em base64, usada como refresh token
 * @returns {Promise<string>} Refresh token gerado
 */
export async function genRefreshToken(){
    return promisify(randomBytes)(432)
        .then(buffer => buffer.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
        );
}
