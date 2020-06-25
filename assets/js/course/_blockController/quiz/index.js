import { useDidMount } from '@daniakash/lifecycle-hooks';
import Quiz from 'react-quiz-component';

const QuizComponent = ({ id, title, uuid, data }) => {
    useDidMount(() => {
        console.log('QUIZ');
        console.log(data);
    });
    return (
        <div>
            <Quiz quiz={data} />
        </div>
    );
};

export default QuizComponent;
