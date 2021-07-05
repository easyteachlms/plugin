/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { ProvideQuiz } from './context';
import Pages from './pages';
import AlreadyPassed from './already-passed-message';

const Quiz = ({ uuid, courseId, userId, data }) => {
    const { title, parentTitle } = data;
    if ( false === data ) {
        return <Fragment/>;
    }
    return (
        <ProvideQuiz uuid={uuid} courseId={courseId} userId={userId} data={data}>
            <div>
                <h2>{title}</h2>
                <p><i>{parentTitle}</i></p>
            </div>
            <AlreadyPassed uuid={uuid} />
            <Pages />
        </ProvideQuiz>
    );
};

export default Quiz;