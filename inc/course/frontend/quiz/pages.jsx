/**
 * WordPress Dependencies
 */
import { Fragment, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useQuiz } from './context';
import Answers from './answers';
import Results from './results';

const Pages = () => {
    const [loading, toggleLoading] = useState(false);
    const {
        quizData,
        activePage,
        setActivePage,
        disabled,
        onCompleteAction,
        submitted,
    } = useQuiz();

    if (false === quizData) {
        return <Fragment/>
    }

    if (false !== submitted) {
        return <Results />;
    }

    return (
        <div>
            <div>
            {quizData.map((page, index) => {
                const { answers, answerSelectionType, question, explanation, points } = page;
                return (
                    <Fragment>
                        <h4>{question}</h4>
                        <Answers
                            help={explanation}
                            question={question}
                            answers={answers}
                            points={points}
                            type={answerSelectionType}
                        />
                    </Fragment>
                );
            })}
            </div>       
            {!disabled && (
                <button
                    onClick={() => {
                        toggleLoading(true);
                        onCompleteAction(toggleLoading);
                    }}
                >
                    Submit Quiz
                </button>
            )}
        </div>
    );
};

export default Pages;
