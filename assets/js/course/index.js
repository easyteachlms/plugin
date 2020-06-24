import './style.scss';

import domReady from '@wordpress/dom-ready';
import ReactHtmlParser from 'react-html-parser';

import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment, render, useState } from '@wordpress/element';
import { getQueryArg } from '@wordpress/url';
import { useDidMount } from '@daniakash/lifecycle-hooks';

import { Grid } from 'semantic-ui-react';

import blockController from './_blockController';
import Outline from './outline';

import dataStore from '../data-store';

const Course = ({ id, children }) => {
    const reactElms = ReactHtmlParser(children);

    const { data, loaded } = useSelect(
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
            };
        },
        [id],
    );

    const { setActive } = useDispatch('easyteachlms/course');

    const style = 'default';

    const windowState = () => {
        const expectedUUID = getQueryArg(window.location.href, 'uuid');
        if (expectedUUID) {
            setActive(expectedUUID);
        }
    };

    useDidMount(() => {
        // Get data
        windowState();
    });
    console.log(loaded);
    console.log(data);

    return (
        <Fragment>
            {true === loaded && (
                <Grid divided>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Outline data={data} />
                        </Grid.Column>
                        <Grid.Column width={11}>
                            {blockController(reactElms, data, style)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )}
        </Fragment>
    );
};

/** Initialize from static markup */
domReady(() => {
    if (document.querySelector('.wp-block-easyteachlms-course')) {
        const elms = document.querySelectorAll('.wp-block-easyteachlms-course');
        elms.forEach((value) => {
            // eslint-disable-next-line radix
            const id = parseInt(value.getAttribute('data-course-id'));
            const children = value.innerHTML;
            render(<Course id={id}>{children}</Course>, value);
        });
    }
});
