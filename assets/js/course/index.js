// Determines style selected and then proceeds to load the course correctly.
// Dives through finding the lesson block and gathering up its resources.
import { withState } from '@wordpress/compose';
import { render, Fragment } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import ReactHtmlParser from 'react-html-parser';
import apiFetch from '@wordpress/api-fetch';
import { useDidMount } from '@daniakash/lifecycle-hooks';

import { Grid } from 'semantic-ui-react';
import Outline from './outline';
import blockController from './blockController';

import './store';

const Course = withState({
    loaded: false,
    data: false,
    active: false,
    items: '',
})(({ loaded, data, active, items, setState, id, children }) => {
    const { outline } = data;

    const init = () => {
        apiFetch({ path: `/easyteachlms/v3/course/get/?course_id=${id}` }).then(
            (d) => {
                console.log('Course Data');
                console.log(d);
                setState({
                    loaded: true,
                    data: d,
                });
            },
        );
    };

    const reactElms = ReactHtmlParser(children);

    useDidMount(() => {
        console.log('Mounted');
        init();
    });

    const setActive = (uuid) => {
        setState({ active: uuid });
        console.log(active);
    };

    // Outline

    return (
        <Fragment>
            {true === loaded && (
                <Grid divided>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Outline data={outline} />
                        </Grid.Column>
                        <Grid.Column width={11}>
                            {blockController(reactElms, data, active)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )}
        </Fragment>
    );
});

// Initialize from static markup
domReady(() => {
    if (document.querySelector('.wp-block-easyteachlms-course')) {
        const elms = document.querySelectorAll('.wp-block-easyteachlms-course');
        elms.forEach((value) => {
            const id = parseInt(value.getAttribute('data-course-id'));
            const children = value.innerHTML;
            render(<Course id={id}>{children}</Course>, value);
        });
    }
});
