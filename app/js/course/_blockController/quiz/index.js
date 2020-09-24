import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Header } from 'semantic-ui-react';
import apiFetch from '@wordpress/api-fetch';

import { templateSettings } from 'lodash';
import Pages from './pages';

const user = window.userData;
const { id } = user;

const Quiz = ({ uuid, parentTitle, title }) => {
    const { isLocked, courseId, isActive, questions } = useSelect(
        (select) => {
            return {
                isLocked: select('easyteachlms/course').isLocked(uuid),
                isActive: select('easyteachlms/course').getActive() === uuid,
                courseId: select('easyteachlms/course').getCourseId(),
                questions: select('easyteachlms/course').getQuestions(uuid),
            };
        },
        [uuid],
    );

    const { setConditionsMet, setComplete, setQuizScore } = useDispatch(
        'easyteachlms/course',
    );

    if (true !== isActive) {
        return <Fragment />;
    }

    if (false !== isLocked) {
        return <Fragment>Quiz Locked Until {isLocked}</Fragment>;
    }

    const gradeQuiz = (answers) => {
        const tmpQuestions = questions;

        const answersMatch = (arr1, arr2) => {
            console.log('answersMatch?', arr1, arr2);
            // Check if the arrays are the same length
            if (arr1.length !== arr2.length) return false;

            // Check if all items exist and are in the same order
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) return false;
            }

            // Otherwise, return true
            return true;
        };

        questions.forEach((q, index) => {
            const { question, correctAnswer, points } = q;
            const givenAnswer = answers[question];
            // We need to account for multiple choice and doing points awarded by how many of the answers you got right.
            if (answersMatch(givenAnswer, correctAnswer)) {
                console.log('Correct!', q);
                tmpQuestions[index].pointsAwarded = points;
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

    // Grade the quiz,

    const onCompleteAction = (selectedAnswers) => {
        console.log('onCompleteAction', questions);
        console.log(selectedAnswers);
        gradeQuiz(selectedAnswers);
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

    return (
        <div>
            <Header as="h2" dividing>
                {title}
                {false !== parentTitle && (
                    <Header.Subheader>{parentTitle}</Header.Subheader>
                )}
            </Header>
            <Pages uuid={uuid} onComplete={onCompleteAction} />
        </div>
    );
};

export default Quiz;
