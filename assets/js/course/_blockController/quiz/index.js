import { useDidMount } from '@daniakash/lifecycle-hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import Quiz from 'react-quiz-component';
import apiFetch from '@wordpress/api-fetch';

const QuizComponent = ({ uuid }) => {
    console.log('QuizComponent');
    console.log(uuid);
    const { data, loaded } = useSelect(
        (select) => {
            const d = select('easyteachlms/course').getQuiz(uuid);
            console.log(d);

            let loaded = false;
            if (false !== data) {
                loaded = true;
            }
            return {
                data: d,
                loaded,
            };
        },
        [uuid],
    );

    useDidMount(() => {
        console.log('QUIZ');
        // console.log(data);
    });

    const onCompleteAction = (obj) => {
        // This makes most sense to send the data sep from the results page.
        console.log(obj);
        // YOUR LOGIC GOES HERE
    };

    return (
        <div>
            {false !== loaded && (
                <Quiz quiz={data} onComplete={onCompleteAction} />
            )}
        </div>
    );
};

export default QuizComponent;
