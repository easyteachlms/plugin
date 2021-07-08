/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready';
import { render, Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { WPTokenSearchField } from '@easyteachlms/components';

domReady(function() {
    if (!document.getElementById('easyteach-course-field') && !document.querySelector('input[name="elms_attached_courses"]')) {
        return;
    }
    const inputField = document.querySelector('input[name="elms_attached_courses"]');
    console.log('inputField', inputField.value);
    // const value = JSON.parse(inputField.value);
    const value = [];
    render(
        <Fragment>
            <div style={{
                padding: '1.5em',
            }}>
                <WPTokenSearchField
                    postType="course"
                    value={value}
                    onSaveValue={(tokens) => {
                        // When these are changed we should save the data to an input value, json stringified of course. 
                        console.log('tokens Changed!', inputField, JSON.stringify(tokens), JSON.parse(JSON.stringify(tokens)));
                        if ( tokens.length !== 0 ) {
                            inputField.value = JSON.stringify(tokens);
                        }
                    }}
                />
            </div>
        </Fragment>,
        document.getElementById('easyteach-course-field'),
    );
});
