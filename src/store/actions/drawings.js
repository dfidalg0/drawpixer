import axios from 'axios';

export const saveDrawing = (title, grid) => async (dispatch, getState) => {
    var state = getState();
    const { token } = state.auth;
    try {
        await axios.post('/api/drawings/create', {
            title: title,
            grid: grid,
        }, {
            headers: {
                Authorization: token
            }
        }).then(function (response) {
            // sucesso
            alert(response.data.message);
        })
    }
    catch ({ response: { data } }) {
        alert(data.message);
    }
};

export const getUserDrawings = () => async (dispatch, getState) => {
    var state = getState();
    const { token } = state.auth;
    try {
        const response = await axios.get('/api/drawings/mine', {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    }
    catch ({ response: { data } }) {
        alert('Erro: ' + data.message);
    }
};
