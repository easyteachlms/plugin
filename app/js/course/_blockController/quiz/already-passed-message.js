import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Message } from 'semantic-ui-react';

import { useQuiz } from './context';

const AlreadyPassed = ({ uuid }) => {
    const { submitted } = useQuiz();
    const { hasUserTakenQuiz, isComplete } = useSelect(
        (select) => {
            return {
                hasUserTakenQuiz: select(
                    'easyteachlms/course',
                ).hasUserTakenQuiz(uuid),
                isComplete: select('easyteachlms/course').isComplete(uuid),
            };
        },
        [uuid],
    );

    if (false === hasUserTakenQuiz) {
        return <Fragment />;
    }

    if (false !== hasUserTakenQuiz && false !== submitted) {
        return <Fragment />;
    }

    return (
        <Message
            success={isComplete}
            info={!isComplete}
            header="You've recently taken this quiz"
            content={() => {
                const { score, pointsRequiredToPass } = hasUserTakenQuiz;
                if (score >= pointsRequiredToPass) {
                    return `You passed with a score of: ${score}`;
                }
                return `You did not pass, you scored ${score}, please try again.`;
            }}
        />
    );
};

export default AlreadyPassed;
