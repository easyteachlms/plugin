import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Header } from 'semantic-ui-react';
import apiFetch from '@wordpress/api-fetch';

import Pages from './pages';

const user = window.userData;
const { id } = user;

const Quiz = ({ uuid, parentTitle, title }) => {
    const { isLocked, courseId, isActive } = useSelect(
        (select) => {
            return {
                isLocked: select('easyteachlms/course').isLocked(uuid),
                isActive: select('easyteachlms/course').getActive() === uuid,
                courseId: select('easyteachlms/course').getCourseId(),
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

    const gradeQuiz = () => {};

    const onCompleteAction = (obj) => {
        console.log('onCompleteAction');
        console.log(obj);

        const { correctPoints, totalPoints } = obj;
        const userScore = { score: correctPoints, total: totalPoints };
        apiFetch({
            path: `/easyteachlms/v3/student/update-quiz-progress/?userId=${id}&uuid=${uuid}&courseId=${courseId}`,
            method: 'POST',
            data: userScore,
        }).then(() => {
            setQuizScore(uuid, userScore);
            // If score is high enough score??
            if (0 !== userScore.score) {
                setConditionsMet(uuid);
                setComplete(uuid);
            }
        });
    };

    return (
        <div>
            <Header as="h2" dividing>
                {title}
                {false !== parentTitle && (
                    <Header.Subheader>{parentTitle}</Header.Subheader>
                )}
            </Header>
            <Pages uuid={uuid} />
        </div>
    );
};

export default Quiz;
