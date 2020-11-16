/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { Fragment, useState } from '@wordpress/element';
import { Accordion, Icon, Button } from 'semantic-ui-react';
import { useQuiz } from './context';
import Answers from './answers';
import Results from './results';

const Pages = () => {
    const {
        quizData,
        activeItem,
        setActiveItem,
        disabled,
        onCompleteAction,
        submitted,
    } = useQuiz();
    const [loading, toggleLoading] = useState(false);

    if (false !== submitted) {
        return <Results />;
    }

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
                loading={loading}
                disabled={disabled}
                onClick={() => {
                    toggleLoading(true);
                    onCompleteAction(toggleLoading);
                }}
            >
                Submit Quiz
            </Button>
        </Accordion>
    );
};

export default Pages;
