import { Fragment } from '@wordpress/element';
import { Icon, List, Message } from 'semantic-ui-react';
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
        return <Message header="Scores" list={items} />;
    };

    return (
        <Fragment>
            <h3>Quiz Results</h3>
            <PointsToolbar />
            <List divided size="large">
                {quizData.map((page) => {
                    const { answers, answerSelectionType, question } = page;
                    const yourAnswers = entryData[question];
                    return (
                        <List.Item>
                            <span>{question}</span>
                            <List>
                                {answers.map((answer, index) => (
                                    <List.Item>
                                        <Icon
                                            name={
                                                yourAnswers.includes(index)
                                                    ? 'check circle'
                                                    : 'remove circle'
                                            }
                                        />
                                        {answer}
                                    </List.Item>
                                ))}
                            </List>
                        </List.Item>
                    );
                })}
            </List>
        </Fragment>
    );
};

export default Results;
