/* eslint-disable default-case */
const DEFAULT_STATE = {
    active: false,
    data: false,
};

const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return {
                ...state,
                data: action.data,
            };
        case 'SET_ACTIVE':
            return {
                ...state,
                active: action.uuid,
            };
        case 'UPDATE_PROGRESS':
            return {
                ...state,
                completed: action.success,
            };
    }
    return state;
};

export default reducer;
