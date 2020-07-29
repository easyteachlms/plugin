import { __ } from '@wordpress/i18n';
import { PanelBody, TextareaControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

const Controls = ({description, setAttributes}) => {
    return(
        <InspectorControls>
            <PanelBody title={__('Certificate Style Settings')}>
                <div>
                    <TextareaControl
                        label="Course Description"
                        help="Give a short description for your course, this will appear on the course dashboard."
                        value={ description }
                        onChange={ ( description ) => setAttributes( { description } ) }
                    />
                </div>
            </PanelBody>
        </InspectorControls>
    );
}

export default Controls;