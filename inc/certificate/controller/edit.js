/**
 * External Dependencies
 */
import { v1 as uuidv1 } from 'uuid';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { 
    ColorPicker,
    Modal,
    PanelBody, 
    RangeControl,
    ToolbarButton
} from '@wordpress/components';
import { 
    useInnerBlocksProps, 
    InspectorControls
} from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import { Collapsible } from '@easyteachlms/components';
import './style.scss';

const ALLOWED_BLOCKS = ['core/heading', 'core/paragraph', 'core/image', 'core/list', 'core/spacer', 'easyteachlms/certificate-date', 'easyteachlms/certificate-student-name'];

const TEMPLATE = [
    [ 'core/spacer', { height: 40 } ],
    [ 'core/heading', { content: 'Certificate of Completion' } ],
    [ 'core/heading', { content: 'Getting started with EasyTeach LMS', level: 4 } ],
    [ 'easyteachlms/certificate-date' ],
    [ 'easyteachlms/certificate-student-name' ],
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
    setAttributes,
}) => {
    const { uuid, backgroundColor, borderColor, requiredScore } = attributes; 

    const [previewOpen, togglePreview] = useState(false);

    const innerBlockProps = useInnerBlocksProps({
        style: {
            border: '4px solid',
            borderColor,
            backgroundColor,
            padding: '1em',
            marginTop: '1em',
        }
    }, {
        allowedBlocks: ALLOWED_BLOCKS,
        template: TEMPLATE,
    });

    if (0 === uuid) {
        setAttributes({
            uuid: uuidv1(),
        });
    }

    return (
        <Collapsible className={className} title='Completion Certificate' defaultOpen={false} postType="certificate" toolbarExtra={()=>{
            return(<ToolbarButton icon="printer" label={__(`Preview`)}>Print Preview</ToolbarButton>);
        }}>
            {previewOpen && (
                <Modal
                    title="This is my modal"
                    onRequestClose={ () => togglePreview(false) }>
                    <h1>Hi!</h1>
                </Modal>
            )}
            <Controls backgroundColor={backgroundColor} borderColor={borderColor} setAttributes={setAttributes} requiredScore={requiredScore}/>
            <div {...innerBlockProps}/>
        </Collapsible>
    );
};

export default edit;
