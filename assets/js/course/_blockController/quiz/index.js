import { useDidMount } from '@daniakash/lifecycle-hooks';
import Quiz from 'react-quiz-component';
import apiFetch from '@wordpress/api-fetch';
import QuizResults from './results';

const QuizComponent = ({ id, title, uuid, data }) => {
    useDidMount(() => {
        console.log('QUIZ');
        console.log(data);
    });

    const onCompleteAction = (obj) => {
        // This makes most sense to send the data sep from the results page.
        console.log(obj);
        // YOUR LOGIC GOES HERE
    };

    return (
        <div>
            <Quiz quiz={data} onComplete={onCompleteAction} />
        </div>
    );
};

export default QuizComponent;
