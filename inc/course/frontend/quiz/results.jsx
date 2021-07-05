/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useQuiz } from './context';

const Results = () => {
    const { entryData, quizData, submitted } = useQuiz();
    console.log('<Results/>', submitted);

    const PointsToolbar = () => {
        const items = [
            `Total Points: ${submitted.total}`,
            `Required to Pass: ${submitted.pointsRequiredToPass}`,
            `Your Score: ${submitted.score}`,
        ];
        return items.map(e => {
            return(<div>{e}</div>);
        });
    };

    return (
        <Fragment>
            <h3>Quiz Results</h3>
            <PointsToolbar />
            <ul>
                {quizData.map((page) => {
                    const { answers, answerSelectionType, question } = page;
                    const yourAnswers = entryData[question];
                    return (
                        <li>
                            <span>{question}</span>
                            <ol>
                                {answers.map((answer, index) => (
                                    <li>
                                        {yourAnswers.includes(index)
                                                    ? 'check circle'
                                                    : 'remove circle'}
                                        {answer}
                                    </li>
                                ))}
                            </ol>
                        </li>
                    );
                })}
            </ul>
        </Fragment>
    );
};

export default Results;
