import { Fragment, useState } from '@wordpress/element';

import PostsMultiSelectField from './post-select-field';

import './style.scss';

const AddCoursesField = ({ inputField }) => {
    console.log(inputField);

    const courseIds = inputField.value.split(',').map(Number);
    console.log('Values we already have');
    console.log(courseIds);

    const onChange = (e, d) => {
        const { value } = d;
        inputField.value = value.join();
    };

    return <PostsMultiSelectField postType="Course" horizontal />;
};

export default AddCoursesField;
