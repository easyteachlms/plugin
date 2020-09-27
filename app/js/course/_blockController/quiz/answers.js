import { List, Radio, TextArea } from 'semantic-ui-react';
import { useQuiz } from './context';

const Answers = ({ question, answers, type }) => {
    const { entryData, answerHandler } = useQuiz();

    const handler = (answer, index) => {
        answerHandler(answer, index, type, question);
    };

    if ('text' === type) {
        return (
            <TextArea
                placeholder="Your answer here"
                onChange={(e, { value }) => handler(value, null)}
            />
        );
    }

    return (
        <List>
            {'single' === type && (
                <p>
                    <i>Select one answer.</i>
                </p>
            )}
            {'multiple' === type && (
                <p>
                    <i>Select one, or more answer(s).</i>
                </p>
            )}
            {answers.map((answer, index) => (
                <List.Item>
                    <Radio
                        label={answer}
                        onClick={() => handler(answer, index)}
                        checked={entryData[question].includes(index)}
                    />
                </List.Item>
            ))}
        </List>
    );
};

export default Answers;
