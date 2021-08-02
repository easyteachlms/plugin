/**
 * WordPress Dependencies
 */
import { Fragment, useEffect, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { ProvideQuiz } from './context';
import Pages from './pages';
import AlreadyPassed from './already-passed-message';

const Quiz = () => {
    return (
        <ProvideQuiz>
            <AlreadyPassed/>
            <Pages />
        </ProvideQuiz>
    );
};

export default Quiz;