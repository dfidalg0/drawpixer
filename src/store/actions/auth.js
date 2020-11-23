// Tipos de ação de autenticação
import {
    SET_TOKEN,
    SET_USER,
} from './types';

// Bibliotecas auxiliares
import axios from 'axios';
import jwt from 'jsonwebtoken';

import { setLoading } from './ui';
import { clearDrawings } from './drawings';

// Criadores de ações básicas
const setToken = token => ({
    type: SET_TOKEN,
    token
});

const setUser = user => ({
    type: SET_USER,
    user
});

// Objeto para controle da rotação do token de acesso
let refreshTimeout;

// Rotação do token de acesso
const refresh = timeout => async (dispatch, getState) => {
    refreshTimeout = setTimeout(async () => {
        // Obtenção do token atual pelo estado atual do Redux
        const { auth: { token } } = getState();

        try {
            // Obtenção de um novo token de acesso a partir do anterior
            const { data } = await axios.post('/api/jwt/refresh', { token });

            const newToken = data.token;

            // Obtenção das datas de emissão (iat) e expiração (exp) do novo token
            const { exp, iat } = jwt.decode(newToken);

            // Atualização do token no estado do Redux
            dispatch(setToken(newToken));
            // Inicialização da nova rotação do token 5 minutos antes de sua
            // expiração
            dispatch(refresh(exp - iat - 5 * 60));
        }
        catch (err) {
            console.error(err);
            // Tentar de novo dentro de 30 segundos
            dispatch(refresh(30));
        }
    }, timeout * 1000);
};

// Carregamento das informações do usuário através do token de acesso
const loadUser = token => async dispatch => {
    if (token){
        // Atualização do token no estado do Redux
        dispatch(setToken(token));

        // Obtenção das informções do token
        const { exp, iat, ...user } = jwt.decode(token);

        // Atualização do usuário no estado do Redux
        dispatch(setUser(user));

        // Inicialização do primeiro ciclo de rotação do token de acesso
        dispatch(refresh(exp - iat - 5 * 60));
    }
    else throw new Error('Bad call of loadUser. Token does not exist');
};

// Login com Google
export const googleLogin = googleUser => async dispatch => {
    // Obtenção do token de autenticação do Google através da resposta
    // do botão de Login
    const { id_token: idToken } = googleUser.getAuthResponse();

    try {
        // Aplicação colocada em estado de carregamento
        dispatch(setLoading(true));

        // Obtenção do token de acesso a partir do login com Google
        const { data: { token } } = await axios.post('/api/login/google', { idToken });

        // Carregamento do usuário atual
        dispatch(loadUser(token));
    }
    catch({ response: { data } }){
        alert(data.message);
    }
    finally {
        // Aplicação colocada fora de estado de carregamento
        dispatch(setLoading(false));
    }
};

export const login = (email, password) => async dispatch => {
    try {
        // Aplicação colocada em estado de carregamento
        dispatch(setLoading(true));

        // Obtenção do token de acesso a partir do login convencional
        const { data: { token } } = await axios.post('/api/login', {
            email, password
        });

        // Carregamento do usuário atual
        dispatch(loadUser(token));
    }
    catch({ response: { data } }){
        alert(data.message);
    }
    finally {
        // Aplicação colocada fora de estado de carregamento
        dispatch(setLoading(false));
    }
};

export const register = (name, email, password, passConfirm) => async dispatch => {
    try {
        // Aplicação colocada em estado de carregamento
        dispatch(setLoading(true));

        // Obtenção do token de acesso a partir do cadastro
        const { data: { token } } = await axios.post('/api/register', {
            name, email, password, passConfirm
        });

        // Carregamento do novo usuário cadastrado
        dispatch(loadUser(token));
    }
    catch({ response: { data } }){
        alert(data.message);
    }
    finally {
        // Aplicação colocada fora de estado de carregamento
        dispatch(setLoading(false));
    }
};

// Ação para verificação do Login (despachada apenas uma vez na abertura do site)
export const checkLogin = () => async dispatch => {
    try {
        // Aplicação colocada em estado de carregamento
        dispatch(setLoading(true));

        // Obtenção de um token de acesso através do refreshToken
        // que está armazenado em um cookie inacessível por Javascript
        const { data } = await axios.post('/api/jwt/create');

        const { token } = data;

        // Se um token for obtido, o usuário está autenticado
        if (token) {
            dispatch(loadUser(token));
        }
    }
    catch (err) {
        console.error(err);
    }
    finally {
        // Aplicação retirada do estado de carregamento
        dispatch(setLoading(false));
    }
}

// Logout do usuário
export const logout = () => async (dispatch, getState) => {
    // Obtenção do token de acesso atual
    const { auth: { token } } = getState();

    try {
        // Aplicação colocada em estado de carregamento
        dispatch(setLoading(true));

        // Destruição dos tokens de acesso e refresh
        await axios.post('/api/jwt/destroy', { token });

        // Interrupção do ciclo de rotação de tokens
        clearTimeout(refreshTimeout);

        // Remoção de todos os estados associados ao usuário no Redux
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(clearDrawings());
    }
    catch({ response: { data } }) {
        alert(data.message);
    }
    finally {
        // Aplicação retirada do estado de carregamento
        dispatch(setLoading(false));
    }
};
