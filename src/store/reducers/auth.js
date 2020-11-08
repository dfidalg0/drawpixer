const baseState = {
    loading: true,
    token: null,
    user: null
};

export default function (state = baseState, action) {
    switch(action.type){
    case 'SET_TOKEN':
        return { ...state, token: action.token };
    case 'EXPIRE_TOKEN':
        return { ...state, token: null };
    case 'SET_USER':
        return { ...state, user: action.user };
    case 'SET_LOAD':
        return { ...state, loading: action.loading };
    default:
        return state;
    }
}
