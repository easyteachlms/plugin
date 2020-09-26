/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { Fragment, useEffect } from '@wordpress/element';
import { Accordion, Icon, Button } from 'semantic-ui-react';
import { useQuiz } from './context';
import Answers from './answers';

const Pages = () => {
    const {
        quizData,
        activeItem,
        setActiveItem,
        entryData,
        disabled,
    } = useQuiz();

    useEffect(() => {
        console.log('ENTRYDAYA :: useEffect', entryData);
    }, [entryData]);

    useEffect(() => {
        console.log('PAGES :: useEffect', quizData, entryData);
    }, [quizData, activeItem, entryData]);

    return (
        <Accordion>
            {quizData.map((page, index) => {
                const { answers, answerSelectionType, question } = page;
                return (
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
                                question={question}
                                answers={answers}
                                type={answerSelectionType}
                            />
                        </Accordion.Content>
                    </Fragment>
                );
            })}
            <Button
                primary
                loading={false}
                disabled={disabled}
                onClick={() => {
                    console.log('Done');
                }}
            >
                Submit Quiz
            </Button>
        </Accordion>
    );
};

export default Pages;
