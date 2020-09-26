import {
    useState,
    useEffect,
    useContext,
    createContext,
} from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

const quizContext = createContext();

const { id } = window.userData;

const getTodaysDate = () => {
    const today = new Date();
    const date = `${today.getFullYear()}-${
        today.getMonth() + 1
    }-${today.getDate()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    return `${date} ${time}`;
};

// Provider hook that creates auth object and handles state
const useProvideQuiz = (uuid) => {
    const [quizData, setQuizData] = useState([]);
    const [entryData, setEntryData] = useState({});
    const [activeItem, setActiveItem] = useState(0);
    const [disabled, toggleDisabled] = useState(true);

    const checkForUnAnsweredQuestions = () => {
        console.log('checkForUnAnsweredQuestions');
        const test = Object.keys(entryData);
        let unansweredQuestions = 0;
        test.forEach((e) => {
            if (0 === entryData[e].length) {
                // eslint-disable-next-line no-plusplus
                unansweredQuestions++;
            }
        });
        console.log('unansweredQuestions', unansweredQuestions);
        if (0 === unansweredQuestions) {
            toggleDisabled(false);
        } else {
            toggleDisabled(true);
        }
    };

    const gradeQuiz = (answers) => {
        const tmpQuestions = quizData;

        const computePoints = (answersGiven, correctAnswer, points) => {
            let pointsAwarded = 0;
            const pointsPerAnswer = points / correctAnswer.length;

            answersGiven.forEach((answerIndex) => {
                if (correctAnswer.includes(answerIndex)) {
                    pointsAwarded += pointsPerAnswer;
                }
            });
            return pointsAwarded;
        };

        quizData.forEach((q, index) => {
            const { question, correctAnswer, points } = q;
            const givenAnswer = answers[question];
            const computedPoints = computePoints(
                givenAnswer,
                correctAnswer,
                points,
            );
            // We need to account for multiple choice and doing points awarded by how many of the answers you got right.
            if (0 !== computedPoints) {
                console.log('Correct!', q);
                tmpQuestions[index].pointsAwarded = computedPoints;
                tmpQuestions[index].isCorrect = true;
            } else {
                console.log('Incorrect!', q);
                tmpQuestions[index].pointsAwarded = 0;
                tmpQuestions[index].isCorrect = false;
            }
        });

        // We should pass tmpQuestions to the db for the user and store their entire quiz record there as it was that would be useful.
        console.log(tmpQuestions);
    };

    const answerHandler = (answer, index, type, question) => {
        const s = entryData;
        if ('single' === type) {
            // Add answer
            s[question] = [index];
        } else if ('multiple' === type) {
            if (s[question].includes(index)) {
                // Remove an already added answer
                s[question] = s[question].filter((el) => el !== index);
            } else {
                // Add an answer
                s[question].push(index);
            }
        } else if ('text' === type) {
            s[question] = answer;
        }
        setEntryData({ ...entryData, s });
        console.log('handler', entryData);
    };

    const onCompleteAction = () => {
        console.log('onCompleteAction', quizData);
        console.log(entryData);
        gradeQuiz(entryData);
        // Go through and grade questions. Submit score.

        // const { correctPoints, totalPoints } = obj;
        // const userScore = { score: correctPoints, total: totalPoints };
        // apiFetch({
        //     path: `/easyteachlms/v3/student/update-quiz-progress/?userId=${id}&uuid=${uuid}&courseId=${courseId}`,
        //     method: 'POST',
        //     data: userScore,
        // }).then(() => {
        //     setQuizScore(uuid, userScore);
        //     // If score is high enough score??
        //     if (0 !== userScore.score) {
        //         setConditionsMet(uuid);
        //         setComplete(uuid);
        //     }
        // });
    };

    const initEntry = (questions) => {
        const entry = {};
        questions.forEach((q) => {
            const { question } = q;
            entry[question] = [];
        });
        setEntryData(entry);
    };

    useEffect(() => {
        console.log('entryData Effect', entryData);
        checkForUnAnsweredQuestions();
    }, [entryData]);

    useEffect(() => {
        // Initialize the quiz data....
        const questions = select('easyteachlms/course').getQuestions(uuid);
        initEntry(questions);
        console.log('QUIZ CONTEXT', questions, entryData);
        setQuizData(questions);
    }, []);

    // Return the quiz state and functions
    return {
        quizData,
        activeItem,
        setActiveItem,
        disabled,
        entryData,
        answerHandler,
    };
};

// Provider component, wrap all your sub components to have access to quiz state.
const ProvideQuiz = ({ uuid, children }) => {
    const quiz = useProvideQuiz(uuid);
    return <quizContext.Provider value={quiz}>{children}</quizContext.Provider>;
};

// Hook to access shared state functions and state data.
const useQuiz = () => {
    return useContext(quizContext);
};

export { ProvideQuiz, useQuiz };
export default ProvideQuiz;
