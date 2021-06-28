/* eslint-disable default-case */
const DEFAULT_STATE = {
    active: false,
    certificate: false,
    data: false,
    quizAnswers: false,
};

const reducer = (state = DEFAULT_STATE, action) => {
    const { data } = state;
    const { outline } = data;

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
        case 'SET_QUIZ_SCORE':
            console.log('SET_QUIZ_SCORE');
            console.log(action);
            console.log(action.score);
            console.log(outline.flat);
            // eslint-disable-next-line no-case-declarations
            const quizIndex = outline.flat.findIndex(
                (obj) => 'quiz' === obj.type && obj.uuid === action.uuid,
            );
            console.log(quizIndex);
            console.log(data.outline.flat[quizIndex].userScore);

            data.outline.flat[quizIndex].userScore = action.score;

            console.log(data.outline.flat[quizIndex].userScore);
            return {
                ...state,
                data,
            };
        case 'SET_COMPLETE':
            data.outline.flat[
                outline.flat.findIndex((obj) => obj.uuid === action.uuid)
            ].completed = true;

            // eslint-disable-next-line operator-assignment
            data.outline.completed = data.outline.completed + 1;

            return {
                ...state,
                data,
            };
        case 'SET_CONDITIONS_MET':
            data.outline.flat[
                outline.flat.findIndex((obj) => obj.uuid === action.uuid)
            ].conditionsMet = true;

            return {
                ...state,
                data,
            };
        case 'STORE_CERTIFICATE':
            const certificate = action.markup;
            return {
                ...state,
                certificate,
            };
    }
    return state;
};

export default reducer;