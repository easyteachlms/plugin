// attributes: {
//     question: {
//         type: 'string',
//         default: 'Question Text Here'
//     },
//     type: {
//         type: 'string',
//         default: 'text'
//     },

//     answersType: {
//         type: 'string',
//         default: 'single',
//     },
//     answers: {
//         type: 'object',
//     },
//     correctAnswer: {
//         type: 'string',
//         default: '0',
//     },
//     correctAnswerMessage: {
//         type: 'string',
//         default: 'Correct answer! Good job.',
//     },
//     incorrectAnswerMessage: {
//         type: 'string',
//         default: 'Incorrect answer! Please try again.',
//     },

//     explanation: {
//         type: 'string',
//         default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     },
//     points: {
//         type: 'string',
//         default: '10',
//     },
//     picture: {
//         type: 'string',
//         defualt: '',
//     }
// },

const transformData = attributes => {
    const { question, type, answersType, answers, correctAnswer, correctAnswerMessage, incorrectAnswerMessage, explanation, points, picture } = attributes;
    let data = {
        "question": {question},
        "questionType": {type},
        "answerSelectionType": {answersType},
        "answers": {answers},
        "correctAnswer": {correctAnswer},
        "messageForCorrectAnswer": {correctAnswerMessage},
        "messageForIncorrectAnswer": {incorrectAnswerMessage},
        "explanation": {explanation},
        "point": {points},
    };
    if ( picture ) {
        data.questionPic = picture;
    }
    return data;
}

export default transformData;