/**
 * WordPress Dependencies
 */
import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

/**
 * Internal Dependencies
 */
import './style.scss';
import Quiz from './quiz';

domReady(() => {
    const quizzes = document.querySelectorAll('.wp-block-easyteachlms-quiz');
    quizzes.forEach((quizElm) => {
        const uuid = quizElm.getAttribute('data-uuid');
        render(
            <Quiz uuid={uuid} parentTitle="Parent Title" title="Title" />,
            quizElm,
        );
    });
});
