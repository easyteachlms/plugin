/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { Card, CardBody, CardHeader } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useQuiz } from './context';

const AlreadyPassed = () => {
    const { alreadySubmitted } = useQuiz();
    
    if (false === alreadySubmitted) {
        return <Fragment />;
    }

    const { score, pointsRequiredToPass } = alreadySubmitted;
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
