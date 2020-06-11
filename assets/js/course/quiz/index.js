import { useDidMount } from '@daniakash/lifecycle-hooks';
import Quiz from 'react-quiz-component';

const QuizComponent = ({ id, title, data }) => {
    useDidMount(() => {
        console.log('QUIZ');
        console.log(data);
    });
    return (
        <div>
            <h4>Quiz Here</h4>
            <h3>{title}</h3>
            <Quiz quiz={data} />
        </div>
    );
};

export default QuizComponent;
