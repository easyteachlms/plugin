/* eslint-disable default-case */
const DEFAULT_STATE = {
    active: false,
    completed: 0,
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
        case 'SET_COMPLETE':
            // eslint-disable-next-line no-case-declarations
            const { data } = state;
            const { outline } = data;
            const { flat } = outline;
            const index = flat.findIndex((obj) => obj.uuid === action.uuid);
            // eslint-disable-next-line no-case-declarations

            data.outline.flat[index].completed = true;

            return {
                ...state,
                data,
                completed: state.completed + 1,
            };
    }
    return state;
};

export default reducer;
