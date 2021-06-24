/* eslint-disable no-shadow */
import './style.scss';

import domReady from '@wordpress/dom-ready';
import ReactHtmlParser from 'react-html-parser';

import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment, render } from '@wordpress/element';
import { getQueryArg } from '@wordpress/url';
import { useDidMount } from 'beautiful-react-hooks';

import { Grid, Segment } from 'semantic-ui-react';

import blockController from './_blockController';
import Dashboard from './dashboard';
import Outline from './outline';
import Enroll from './enroll-gate';

import '../data-store';

const Course = ({ id, children }) => {
    const reactElms = ReactHtmlParser(children);

    const { setActive } = useDispatch('easyteachlms/course');

    const { data, loaded, isEnrolled } = useSelect(
        (select) => {
            const data = select('easyteachlms/course').getData(id);
            console.log(data);

            let loaded = false;
            if (false !== data) {
                loaded = true;
            }

            return {
                data,
                loaded,
                isEnrolled: data.enrolled,
            };
        },
        [id],
    );

    const style = 'default';

    const windowState = () => {
        const expectedUUID = getQueryArg(window.location.href, 'uuid');
        if (expectedUUID) {
            setActive(expectedUUID);
        } else {
            setActive('dashboard');
        }
    };

    useDidMount(() => {
        // Get data
        windowState();
    });

    return (
        <Segment loading={!loaded} style={{ minHeight: '100px' }}>
            {true === loaded && false === isEnrolled && (
                <Enroll courseId={id} />
            )}
            {true === loaded && true === isEnrolled && (
                <Grid stackable divided>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Outline id={id} />
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Fragment>
                                <Dashboard id={id} />
                                {blockController(reactElms, data, style)}
                            </Fragment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )}
        </Segment>
    );
};

/** Initialize from static markup */
domReady(() => {
    // See if we can get other course content
    if (document.querySelector('.wp-block-easyteachlms-course')) {
        const other = false;
        const elms = document.querySelectorAll('.wp-block-easyteachlms-course');
        elms.forEach((value) => {
            // eslint-disable-next-line radix
            const id = parseInt(value.getAttribute('data-course-id'));
            const children = value.innerHTML;
            render(
                <Course id={id} other={other}>
                    {children}
                </Course>,
                value,
            );
        });
    }
});
