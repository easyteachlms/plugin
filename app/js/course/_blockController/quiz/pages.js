/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { Fragment, useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { Accordion, Icon, Button } from 'semantic-ui-react';

import Answers from './answers';

const Pages = ({ uuid, onComplete }) => {
    const [activeItem, setActiveItem] = useState(0);
    const [disabled, toggleDisabled] = useState(true);

    const { questions } = useSelect(
        (select) => {
            return {
                questions: select('easyteachlms/course').getQuestions(uuid),
            };
        },
        [uuid],
    );

    const [pages, setPages] = useState(false);
    const [allSelected, setSelected] = useState({});

    const checkForData = () => {
        const test = Object.keys(allSelected);
        let numberOfNo = 0;
        test.forEach((e) => {
            if (0 === allSelected[e].length) {
                numberOfNo++;
            }
        });
        if (0 === numberOfNo) {
            toggleDisabled(false);
        } else {
            toggleDisabled(true);
        }
    };

    useEffect(() => {
        const tmp = {};
        questions.map((page, index) => {
            console.log('questionsMap', page);
            const { question } = page;
            tmp[question] = [];
        });
        setSelected(tmp);
    }, [questions]);

    useEffect(() => {
        checkForData();
        const tmp = [];
        questions.map((page, index) => {
            const { answers, answerSelectionType, question } = page;
            tmp.push(
                <Fragment>
                    <Accordion.Title
                        active={index === activeItem}
                        index={index}
                        onClick={() => {
                            setActiveItem(index);
                        }}
                    >
                        <Icon name="dropdown" />
                        {question}
                    </Accordion.Title>
                    <Accordion.Content active={index === activeItem}>
                        <Answers
                            uuid={uuid}
                            question={question}
                            data={answers}
                            type={answerSelectionType}
                            quizState={{ allSelected, setSelected }}
                        />
                    </Accordion.Content>
                </Fragment>,
            );
        });
        setPages(tmp);
    }, [allSelected, activeItem]);

    return (
        <Accordion>
            {pages}
            <Button
                primary
                disabled={disabled}
                loading={false}
                onClick={() => {
                    console.log(allSelected);
                    onComplete(allSelected);
                }}
            >
                Submit Quiz
            </Button>
        </Accordion>
    );
};

export default Pages;
