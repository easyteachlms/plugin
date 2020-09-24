import { List, Radio, TextArea } from 'semantic-ui-react';
import { useEffect, useState, Fragment } from '@wordpress/element';

const Answers = ({ question, data, type, quizState }) => {
    const [answers, setAnswers] = useState(false);
    const [selected, setSelected] = useState([]);

    const globalHandler = (answer) => {
        console.log('globalHandler!', quizState);
        const tmp = quizState.allSelected;
        tmp[question] = answer;
        quizState.setSelected(tmp);
    };

    const handler = (answer, index) => {
        let s = selected;
        if ('single' === type) {
            // Add answer
            s = [index];
        } else if ('multiple' === type) {
            if (s.includes(index)) {
                // Remove an already added answer
                s = s.filter((el) => el !== index);
            } else {
                // Add an answer
                s.push(index);
            }
        } else if ('text' === type) {
            s = answer;
        }
        setSelected(s);
        globalHandler(s);
    };

    useEffect(() => {
        const tmp = [];
        if ('text' === type) {
            tmp.push(
                <TextArea
                    placeholder="Your answer here"
                    onChange={(e, { value }) => handler(value, null)}
                />,
            );
        } else {
            data.forEach((answer, index) => {
                let key = index;
                if ('text' === type) {
                    key = answer;
                }
                tmp.push(
                    <List.Item>
                        <Radio
                            label={answer}
                            onClick={() => handler(answer, index)}
                            checked={selected.includes(key)}
                        />
                    </List.Item>,
                );
            });
        }
        setAnswers(tmp);
    }, [answers]);

    return <List>{answers}</List>;
};

export default Answers;
