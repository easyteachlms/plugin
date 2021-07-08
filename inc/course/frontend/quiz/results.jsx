/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { Dashicon } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useQuiz } from './context';

const Icon = ({correct}) => {   
    if ( correct ) {
        return <Dashicon icon="yes-alt"/>
    }
    return <Dashicon icon="no"/>
}

const Results = () => {
    const { entryData, quizData, submitted } = useQuiz();
    
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
            <h4>Quiz Results</h4>
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
                                       <span style={{display: 'flex', alignItems: 'center'}}>
                                            <Icon correct={yourAnswers.includes(index)}/>
                                            {answer}
                                       </span>
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
