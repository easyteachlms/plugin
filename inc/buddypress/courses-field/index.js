/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';
import { Fragment, render, useEffect, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import PostsMultiSelectField from './post-select-field';

import './style.scss';

const { api } = window.wp;

const AddCoursesField = ({ inputField }) => {
    const courseIds = inputField.value.split(',').map(Number);
    const [defaultValues, setDefaultValues] = useState([]);

    const hocOnChange = (selectedOptions) => {
        console.log('hocOnChange?', selectedOptions);
        const values = selectedOptions.map((a) => a.value);
        console.log(values);
        inputField.value = values.join();
    };

    const fetchDefaultValues = () => {
        const collection = new api.collections.Course();
        collection.fetch({ data: { include: courseIds } }).then((matched) => {
            const available = [];
            matched.forEach((p) => {
                available.push({
                    value: p.id,
                    label: p.title.rendered,
                });
            });
            setDefaultValues(available);
        });
        // We should have an option for if nothing is present, an initial state w no data ever.
    };

    useEffect(() => {
        fetchDefaultValues();
    }, [courseIds]);

    return (
        <Fragment>
            {0 !== defaultValues.length && (
                <PostsMultiSelectField
                    defaultOptions={defaultValues}
                    postType="Course"
                    hocOnChange={hocOnChange}
                />
            )}
            {0 === defaultValues.length && (
                <PostsMultiSelectField
                    postType="Course"
                    hocOnChange={hocOnChange}
                />
            )}
        </Fragment>
    );
};

domReady(()=>{
    if ( document.getElementById('js-easyteach-courses-field') ) {
        const input = document.getElementById('js-easyteach-courses-field').querySelector('input');
        render(<AddCoursesField inputField={input}/>, document.getElementById('js-easyteach-courses-field-attach'));
    }
});