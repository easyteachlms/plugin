import { List, Radio, TextArea } from 'semantic-ui-react';
import { useEffect, useState, Fragment } from '@wordpress/element';

const Answers = ({ uuid, data, type }) => {
    const [answers, setAnswers] = useState(false);
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        const tmp = [];
        data.forEach((answer, index) => {
            tmp.push(
                <List.Item>
                    {'text' !== type && <Radio label={answer} />}
                    {'text' === type && <TextArea label="Your answer here" />}
                </List.Item>,
            );
        });
        setAnswers(tmp);
    }, [answers]);

    return <List>{answers}</List>;
};

export default Answers;
