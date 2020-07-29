import { Fragment, useState } from '@wordpress/element';
import { Dropdown } from 'semantic-ui-react';

import './style.scss';

const AddCoursesField = ({inputField}) => {
    console.log(inputField);
    
    const courseIds = inputField.value.split(',').map(Number);
    console.log("Values we already have");
    console.log(courseIds);

    // Get input field, a comma seperated list, and then add it to the state.
    const options = [
        { text: 'Testing Final Save Mechanism', value: 409 },
        { text: 'Getting Started', value: 341 },
    ];

    const[courses, setCourses] = useState(options);
    const[loading, setLoadingState] = useState(false);

    const onChange = (e,d) => {
        const {value} = d;
        inputField.value = value.join();
    }
    return(
        <Fragment>
            <Dropdown
                placeholder='Course'
                fluid
                multiple
                search
                selection
                loading={loading}
                options={courses}
                onChange={onChange}
                // value={courseIds}
            />
        </Fragment>
    );
}

export default AddCoursesField;