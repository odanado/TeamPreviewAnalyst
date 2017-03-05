import Immutable from 'immutable';
import { CALL_API } from 'redux-api-middleware';
import { handleActions } from 'redux-actions';

const createBody = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return formData;
};

export const fetchPokemons = file => ({
    [CALL_API]: {
        endpoint: 'http://49.212.217.137:40000/upload',
        method: 'POST',
        body: createBody(file),
        types: [
            'REQUEST_FETCH_POKEMONS',
            {
                type: 'SUCCESS_FETCH_POKEMONS',
                payload: (action, state, res) => res.json().then(payload => payload),
            },
            'FAILURE_FETCH_POKEMONS',
        ],
    },
});

const defaultState = Immutable.fromJS({
    pokemons: [],
    isRequesting: false,
});


export const reducer = handleActions({
    SUCCESS_FETCH_POKEMONS: (state, action) =>
        (Immutable.fromJS({ pokemons: action.payload.pokemons, isRequesting: false })),
    REQUEST_FETCH_POKEMONS: () =>
        (Immutable.fromJS({ pokemons: [], isRequesting: true })),
}, defaultState);

