/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { Card, CardBody, CardHeader } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useQuiz } from './context';

const AlreadyPassed = ({ uuid }) => {
    const { submitted } = useQuiz();
    const hasUserTakenQuiz = false;
    const isComplete = false;

    if (false === hasUserTakenQuiz) {
        return <Fragment />;
    }

    if (false !== hasUserTakenQuiz && false !== submitted) {
        return <Fragment />;
    }

    const { score, pointsRequiredToPass } = hasUserTakenQuiz;
    const cardBody = score >= pointsRequiredToPass ? `You passed with a score of: ${score}` : `You did not pass, you scored ${score}, please try again.`;

    return (
        <Card>
            <CardHeader>
                <h4>You have already submitted this quiz</h4>
            </CardHeader>
            <CardBody>
                <p>{cardBody}</p>
            </CardBody>
        </Card>
    );
};

export default AlreadyPassed;
