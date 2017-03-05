import Immutable from 'immutable';
import { createAction } from 'redux-actions';

export const DROP_FILES = 'DROP_FILES';

export const dropFiles = createAction(DROP_FILES, files => ({ files }));

const initialState = Immutable.fromJS({
    files: [],
});

export function reducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
    case DROP_FILES:
        return state.set('files', Immutable.fromJS(payload.files));

    default:
        return state;
    }
}
