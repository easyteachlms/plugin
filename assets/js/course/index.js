import './style.scss';

import { withState } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { render, Fragment } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import ReactHtmlParser from 'react-html-parser';
import apiFetch from '@wordpress/api-fetch';
import { useDidMount } from '@daniakash/lifecycle-hooks';
import { getQueryArg } from '@wordpress/url';
import { Grid } from 'semantic-ui-react';
import blockController from './blockController';
import Outline from './outline';

// Import Course View Data Store
import './store';

const Course = withState({
    loaded: false,
    data: false,
})(({ loaded, data, setState, id, children }) => {
    const { outline } = data;
    const reactElms = ReactHtmlParser(children);
    const { setActive } = useDispatch('easyteachlms/course');

    const style = 'default';

    useDidMount(() => {
        apiFetch({ path: `/easyteachlms/v3/course/get/?course_id=${id}` }).then(
            (d) => {
                console.log('Course Data');
                console.log(d);

                const expectedUUID = getQueryArg(window.location.href, 'uuid');
                if (expectedUUID) {
                    setActive(expectedUUID);
                }
                window.sethTestData = d;

                setState({
                    loaded: true,
                    data: d,
                });
                // After loading data determine which is active and use useDispatch to set accordingly
            },
        );
    });

    return (
        <Fragment>
            {true === loaded && (
                <Grid divided>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Outline data={outline} />
                        </Grid.Column>
                        <Grid.Column width={11}>
                            {blockController(reactElms, data, style)}
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
