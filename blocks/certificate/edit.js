import { __ } from '@wordpress/i18n';
import { v1 as uuidv1 } from 'uuid';
import { Collapsible } from '@easyteachlms/components';
import { ColorPicker, PanelBody, RangeControl } from '@wordpress/components';
import { InnerBlocks, InspectorControls } from '@wordpress/block-editor';

import Certificate from './component';

const ALLOWED_BLOCKS = ['core/heading', 'core/paragraph', 'core/image', 'core/list', 'core/spacer', 'easyteachlms/certificate-date', 'easyteachlms/certificate-student'];

const TEMPLATE = [
    [ 'core/spacer', { height: 170 } ],
    [ 'core/heading', { content: 'Certificate of Completion' } ],
    [ 'core/heading', { content: 'Getting started with EasyTeach LMS', level: 4 } ],
    [ 'easyteachlms/certificate-date' ],
    [ 'easyteachlms/certificate-student' ],
];

const Controls = ({backgroundColor, borderColor, requiredScore, setAttributes}) => {
    return(
        <InspectorControls>
            <PanelBody title={__('Certificate Style Settings')}>
                <div>
                    <p><strong>Background Color</strong></p>
                    <ColorPicker
                        color={ backgroundColor }
                        onChangeComplete={ ( c ) => setAttributes( {backgroundColor: c.hex} ) }
                        disableAlpha
                    />
                </div>
                <div>
                    <p><strong>Border Color</strong></p>
                    <ColorPicker
                        color={ borderColor }
                        onChangeComplete={ ( c ) => setAttributes( {borderColor: c.hex} ) }
                        disableAlpha
                    />
                </div>
                <div>
                    <RangeControl
                        label="Required Score To Pass"
                        value={ requiredScore }
                        onChange={ ( score ) => setAttributes( { requiredScore: score } ) }
                        min={ 50 }
                        max={ 100 }
                    />
                </div>
            </PanelBody>
        </InspectorControls>
    );
}

const edit = ({
    attributes,
    className,
    clientId,
    setAttributes,
    isSelected,
}) => {
    const { uuid, backgroundColor, borderColor, requiredScore } = attributes; 

    if (0 === uuid) {
        setAttributes({
            uuid: uuidv1(),
        });
    }

    return (
        <Collapsible title='Completion Certificate' postType="certificate">
            <Controls backgroundColor={backgroundColor} borderColor={borderColor} setAttributes={setAttributes} requiredScore={requiredScore}/>
            <Certificate backgroundColor={backgroundColor} borderColor={borderColor} display={false} className={className}>
                <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} template={TEMPLATE}/>
            </Certificate>
        </Collapsible>
    );
};

export default edit;
