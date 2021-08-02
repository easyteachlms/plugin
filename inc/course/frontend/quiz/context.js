/**
 * WordPress Dependencies
 */
import {
    useState,
    useEffect,
    useContext,
    createContext,
    Fragment,
} from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal Dependencies
 */
import { useCourse } from '../context';

const quizContext = createContext();

// Provider hook that creates auth object and handles state
const useProvideQuiz = () => {
    const { userId, courseId, currentlyActive, courseData, userCompleted, setCompleted, quizAttempts } = useCourse();
    const [uuid, setUuid] = useState(false);

    // Internal context state
    const [quizData, setQuizData] = useState(false);
    const [entryData, setEntryData] = useState({});
    const [activePage, setActivePage] = useState(0);
    const [passingGrade, setPassingGrade] = useState(80);
    const [disabled, toggleDisabled] = useState(true);
    const [alreadySubmitted, setExistingSubmission] = useState(false);
    const [submitted, setSubmission] = useState(false);

    const initQuizData = () => {
        if ( false === courseData || false === currentlyActive || 'quiz' !== currentlyActive.type ) {
            return;
        }

        const data = courseData.outline.flat.find(o => o.uuid === currentlyActive.target);
        const { pointsRequiredToPass, questions } = data;

        setQuizData(questions);
        initEntry(questions);

        setPassingGrade(pointsRequiredToPass);
        
        setUuid(currentlyActive.target);
        
        if ( 0 !== quizAttempts.length && undefined !== quizAttempts[currentlyActive.target] ) {
            
            // Set quiz attempts here?
            setExistingSubmission({
                score: quizAttempts[currentlyActive.target].score,
                pointsRequiredToPass: parseInt(pointsRequiredToPass),
            });
        }
    }

    const checkForUnAnsweredQuestions = () => {
        
        const test = Object.keys(entryData);
        let unansweredQuestions = 0;
        test.forEach((e) => {
            if (0 === entryData[e].length) {
                // eslint-disable-next-line no-plusplus
                unansweredQuestions++;
            }
        });
        
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
        setEntryData({ ...entryData, ...s });
        
    };

    const gradeQuiz = (answers) => {
        const grade = {
            totalPointsPossible: 0,
            totalPointsAwarded: 0,
            essayAnswers: false,
        };

        const computePoints = (answersGiven, correctAnswer, points) => {
            let pointsAwarded = 0;
            const pointsPerAnswer = points / correctAnswer.length;
            
            // If answersGiven is string then save it to the db, notify the user that their quiz will be graded, activate notification for teacher, when teacher grades activate notification for student.
            answersGiven.forEach((answerIndex) => {
                if (correctAnswer.includes(answerIndex)) {
                    pointsAwarded += pointsPerAnswer;
                }
            });
            return pointsAwarded;
        };

        quizData.forEach((q, index) => {
            const { question, correctAnswer, points, answerSelectionType } = q;
            grade.totalPointsPossible = points + grade.totalPointsPossible;

            const givenAnswer = answers[question];

            // We need to account for multiple choice and doing points awarded by how many of the answers you got right. If present then add the qid and the ansewr to the essayAnswers array if no array then create one.
            if ('text' !== answerSelectionType) {
                const computedPoints = computePoints(
                    givenAnswer,
                    correctAnswer,
                    points,
                );

                if (0 !== computedPoints) {
                    
                    grade.totalPointsAwarded =
                        computedPoints + grade.totalPointsAwarded;
                } else {
                    
                }
            } else {
                // If this is the first text answer then setup the array
                if (false === grade.essayAnswers) {
                    grade.essayAnswers = [];
                }
                grade.essayAnswers.push({
                    question,
                    givenAnswer,
                    points,
                    graded: false,
                });
            }
        });

        // We should pass tmpQuestions to the db for the user and store their entire quiz record there as it was that would be useful.
        
        return grade;
    };

    const onCompleteAction = (passthroughFlag) => {
        const grade = gradeQuiz(entryData);
        const { totalPointsAwarded, totalPointsPossible } = grade;

        // Check if quiz has any free text answers and if so we need to grade the quiz differently. And display different warnings on completion.
        apiFetch({
            path: `/easyteachlms/v4/quiz/submit/?userId=${userId}&uuid=${uuid}&courseId=${courseId}&newScore=${totalPointsAwarded}&passingScore=${parseInt(passingGrade)}`,
            method: 'POST',
            data: entryData,
        }).then(() => {
            passthroughFlag(false);
            console.log('Grading Complete', totalPointsAwarded, parseInt(passingGrade));
            // If score is high enough mark as complete.
            if (totalPointsAwarded >= parseInt(passingGrade)) {
                const tmp = userCompleted;
                tmp.push(uuid);
                setCompleted([...tmp]);
            }
            setExistingSubmission(false);
            setSubmission({
                score: totalPointsAwarded,
                pointsRequiredToPass: parseInt(passingGrade),
            });
        });
    };

    const initEntry = (questions) => {
        const entry = {};
        questions.forEach((q) => {
            const { question } = q;
            entry[question] = [];
        });
        setEntryData(entry);
    };

    useEffect(()=>{
        setTimeout(()=>{
            // Check courseData see if we have already completed this, if so then 
            initQuizData();
        }, 700);
    }, [courseData, currentlyActive, quizAttempts]);

    useEffect(() => {
        checkForUnAnsweredQuestions();
    }, [entryData, quizData]);

    // Return the quiz state and functions
    return {
        quizData,
        activePage,
        setActivePage,
        disabled,
        entryData,
        answerHandler,
        onCompleteAction,
        alreadySubmitted,
        submitted,
        userId,
        uuid,
    };
};

// Provider component, wrap all your sub components to have access to quiz state.
const ProvideQuiz = ({children}) => {
    const quiz = useProvideQuiz();
    
    if ( false === quiz.quizData ) {
        return <Fragment><h4>Loading Quiz... <Spinner/></h4></Fragment>;
    }
    return <quizContext.Provider value={quiz}>{children}</quizContext.Provider>;
};

// Hook to access shared state functions and state data.
const useQuiz = () => {
    return useContext(quizContext);
};

export { ProvideQuiz, useQuiz };
export default ProvideQuiz;
