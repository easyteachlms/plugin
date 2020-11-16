import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { Header } from 'semantic-ui-react';

import { ProvideQuiz } from './context';
import Pages from './pages';
import AlreadyPassed from './already-passed-message';

const Quiz = ({ uuid, parentTitle, title }) => {
    const { isLocked, isActive } = useSelect(
        (select) => {
            return {
                isLocked: select('easyteachlms/course').isLocked(uuid),
                isActive: select('easyteachlms/course').getActive() === uuid,
            };
        },
        [uuid],
    );

    if (true !== isActive) {
        return <Fragment />;
    }

    if (false !== isLocked) {
        return <Fragment>Quiz Locked Until {isLocked}</Fragment>;
    }

    return (
        <ProvideQuiz uuid={uuid}>
            <Header as="h2" dividing>
                {title}
                {false !== parentTitle && (
                    <Header.Subheader>{parentTitle}</Header.Subheader>
                )}
            </Header>
            <AlreadyPassed uuid={uuid} />
            <Pages />
        </ProvideQuiz>
    );
};

export default Quiz;
