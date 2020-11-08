import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

const secret = process.env.JWT_SECRET;

/**
 * @returns {Promise<string>}
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

export function verify(token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
}

export async function genRefreshToken(){
    return promisify(randomBytes)(432)
        .then(buffer => buffer.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
        );
}
