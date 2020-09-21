/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { Fragment, useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { Accordion, Icon, Button } from 'semantic-ui-react';

import Answers from './answers';

const Pages = ({ uuid }) => {
    const [activeItem, setActiveItem] = useState(0);
    const { questions } = useSelect(
        (select) => {
            const d = select('easyteachlms/course').getQuiz(uuid);
            return {
                questions: d.questions,
            };
        },
        [uuid],
    );
    const [pages, setPages] = useState(false);

    useEffect(() => {
        const tmp = [];
        questions.map((page, index) => {
            console.log('Question?');
            console.log(page);
            const { answers, answerSelectionType } = page;
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
                        {page.question}
                    </Accordion.Title>
                    <Accordion.Content active={index === activeItem}>
                        <Answers
                            uuid={uuid}
                            data={answers}
                            type={answerSelectionType}
                        />
                    </Accordion.Content>
                </Fragment>,
            );
        });
        setPages(tmp);
    }, [questions, activeItem]);

    return (
        <Accordion>
            {pages}
            <Button primary disabled loading={false}>
                Submit Quiz
            </Button>
        </Accordion>
    );
};

export default Pages;
