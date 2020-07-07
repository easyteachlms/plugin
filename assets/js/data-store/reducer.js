/* eslint-disable default-case */
const DEFAULT_STATE = {
    active: false,
    completed: 0,
    data: false,
};

const reducer = (state = DEFAULT_STATE, action) => {
    const { data } = state;
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
        case 'ENROLL':
            data.enrolled = action.status;
            return {
                ...state,
                data,
            };
        case 'SET_COMPLETE':
            // eslint-disable-next-line no-case-declarations
            const { outline } = data;
            // eslint-disable-next-line no-case-declarations
            const { flat } = outline;
            // eslint-disable-next-line no-case-declarations
            const index = flat.findIndex((obj) => obj.uuid === action.uuid);
            // eslint-disable-next-line no-case-declarations

            data.outline.flat[index].completed = true;

            // eslint-disable-next-line operator-assignment
            data.outline.completed = data.outline.completed + 1;

            return {
                ...state,
                data,
            };
    }
    return state;
};

export default reducer;
