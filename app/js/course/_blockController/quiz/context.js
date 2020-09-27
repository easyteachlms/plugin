import {
    useState,
    useEffect,
    useContext,
    createContext,
} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

const quizContext = createContext();

const { id } = window.userData;

// Provider hook that creates auth object and handles state
const useProvideQuiz = (uuid) => {
    const [quizData, setQuizData] = useState([]);
    const [entryData, setEntryData] = useState({});
    const [activeItem, setActiveItem] = useState(0);
    const [disabled, toggleDisabled] = useState(true);
    const [submitted, setSubmission] = useState(false);
    const { setComplete, setQuizScore, setConditionsMet } = useDispatch(
        'easyteachlms/course',
    );
    // Get data from our WP data redux api.
    const { courseId, questions, pointsRequiredToPass } = useSelect(
        (select) => {
            return {
                courseId: select('easyteachlms/course').getCourseId(),
                questions: select('easyteachlms/course').getQuestions(uuid),
                pointsRequiredToPass: select(
                    'easyteachlms/course',
                ).getPointsRequiredToPass(uuid),
            };
        },
        [uuid],
    );

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

    const gradeQuiz = (answers) => {
        const grade = {
            totalPointsPossible: 0,
            totalPointsAwarded: 0,
        };

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
            grade.totalPointsPossible = points + grade.totalPointsPossible;
            // We need to account for multiple choice and doing points awarded by how many of the answers you got right.
            if (0 !== computedPoints) {
                console.log('Correct!', q);
                grade.totalPointsAwarded =
                    computedPoints + grade.totalPointsAwarded;
            } else {
                console.log('Incorrect!', q);
            }
        });

        // We should pass tmpQuestions to the db for the user and store their entire quiz record there as it was that would be useful.
        console.log(grade);
        return grade;
    };

    const onCompleteAction = (passthroughFlag) => {
        console.log('---------- Done ---------');
        console.log('onCompleteAction', quizData);
        console.log(entryData);
        const grade = gradeQuiz(entryData);
        // Go through and grade questions. Submit score.

        const { totalPointsAwarded, totalPointsPossible } = grade;

        const userScore = {
            score: totalPointsAwarded,
            total: totalPointsPossible,
            // eslint-disable-next-line radix
            pointsRequiredToPass: parseInt(pointsRequiredToPass),
        };

        console.log('userScore', userScore);

        apiFetch({
            path: `/easyteachlms/v3/student/update-quiz-progress/?userId=${id}&uuid=${uuid}&courseId=${courseId}`,
            method: 'POST',
            data: userScore,
        }).then(() => {
            console.log('grading', userScore, pointsRequiredToPass);
            passthroughFlag(false);
            setQuizScore(uuid, userScore);
            // If score is high enough score??
            if (userScore.score >= pointsRequiredToPass) {
                setConditionsMet(uuid);
                setComplete(uuid);
            }
            setSubmission(userScore);
            console.log('---------- Done ---------');
        });
    };

    const initEntry = () => {
        const entry = {};
        questions.forEach((q) => {
            const { question } = q;
            entry[question] = [];
        });
        setEntryData(entry);
    };

    useEffect(() => {
        initEntry();
        console.log('QUIZ CONTEXT', questions, entryData);
        setQuizData(questions);
    }, [questions]);

    useEffect(() => {
        checkForUnAnsweredQuestions();
    }, [entryData, questions]);

    // Return the quiz state and functions
    return {
        quizData,
        activeItem,
        setActiveItem,
        disabled,
        entryData,
        answerHandler,
        onCompleteAction,
        submitted,
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
