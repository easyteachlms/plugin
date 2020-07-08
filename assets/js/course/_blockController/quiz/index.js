import { useDidMount } from '@daniakash/lifecycle-hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import Quiz from 'react-quiz-component';
import apiFetch from '@wordpress/api-fetch';

const user = window.userData;
const { id } = user;

const QuizComponent = ({ uuid }) => {
    const { data, loaded, courseId } = useSelect(
        (select) => {
            const d = select('easyteachlms/course').getQuiz(uuid);
            let l = false;
            if (false !== d) {
                l = true;
            }
            return {
                data: d,
                loaded: l,
                courseId: select('easyteachlms/course').getCourseId(),
            };
        },
        [uuid],
    );

    const { setConditionsMet, setQuizScore } = useDispatch(
        'easyteachlms/course',
    );

    useDidMount(() => {
        console.log('QUIZ');
        // console.log(data);
    });

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
            // If score is high enough score??
            setConditionsMet(data.parent);
            setQuizScore(uuid, userScore);
        });
    };

    return (
        <div>
            {false !== loaded && (
                // If you alread have taken this quiz then we should say something here, like you scored X
                <Quiz quiz={data} onComplete={onCompleteAction} />
            )}
        </div>
    );
};

export default QuizComponent;
