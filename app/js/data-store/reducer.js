/* eslint-disable default-case */
const DEFAULT_STATE = {
    active: false,
    certificate: false,
    data: false,
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
            // eslint-disable-next-line no-case-declarations
            const quizIndex = outline.flat.findIndex(
                (obj) =>
                    obj.hasQuiz &&
                    // eslint-disable-next-line no-prototype-builtins
                    obj.hasOwnProperty('quiz') &&
                    obj.quiz.uuid === action.uuid,
            );
            console.log(quizIndex);
            console.log(data.outline.flat[quizIndex].quiz.userScore);
            console.log(action);
            console.log(action.scores);
            data.outline.flat[quizIndex].quiz.userScore = action.scores;
            console.log(data.outline.flat[quizIndex].quiz.userScore);
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
            let certificate = action.markup;
            return {
                ...state,
                certificate,
            };
            
    }
    return state;
};

export default reducer;
