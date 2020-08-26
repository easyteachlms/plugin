import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Header } from 'semantic-ui-react';
import Quiz from 'react-quiz-component';
import apiFetch from '@wordpress/api-fetch';

const user = window.userData;
const { id } = user;

const QuizComponent = ({ uuid, parentTitle, title }) => {
    const { data, loaded, courseId, isActive } = useSelect(
        (select) => {
            const d = select('easyteachlms/course').getQuiz(uuid);
            let l = false;
            if (false !== d) {
                l = true;
            }
            return {
                data: d,
                loaded: l,
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
            {false !== loaded && (
                // If you alread have taken this quiz then we should say something here, like you scored X
                <Quiz quiz={data} onComplete={onCompleteAction} />
            )}
        </div>
    );
};

export default QuizComponent;
