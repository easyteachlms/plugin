// Determines style selected and then proceeds to load the course correctly.
// Dives through finding the lesson block and gathering up its resources.
import { withState } from '@wordpress/compose';
import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import ReactHtmlParser from 'react-html-parser';
import apiFetch from '@wordpress/api-fetch';
import { useDidMount } from '@daniakash/lifecycle-hooks';

import blockController from './blockController';

const Course = withState({
    loaded: false,
    data: false,
    items: '',
})(({ loaded, data, items, setState, children }) => {
    const init = (reactElms) => {
        apiFetch({ path: '/easyteachlms/v3/course/get/?course_id=193' }).then(
            (d) => {
                setState({
                    loaded: true,
                    data: d,
                    items: blockController(reactElms, d),
                });
            },
        );
    };

    // const HTMLParser = new Parser();
    const courseAsReactElement = ReactHtmlParser(children);

    useDidMount(() => {
        init(courseAsReactElement);
    });

    return <div className="easyteach-lms-course">{items}</div>;
});

domReady(() => {
    if (document.querySelector('.wp-block-easyteachlms-course')) {
        const elms = document.querySelectorAll('.wp-block-easyteachlms-course');
        elms.forEach((value) => {
            const children = value.innerHTML;
            render(<Course>{children}</Course>, value);
        });
    }
});
