import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
    Panel,
    PanelBody,
    PanelRow,
    TextControl,
    ToggleControl,
} from '@wordpress/components';

const Controls = ({ attributes, setAttributes, clientId }) => {
    const panelTitle = 'Quiz Settings';
    const { uuid, pointsRequiredToPass, requirePassing } = attributes;

    const {updateBlockAttributes} = useDispatch('core/block-editor');

    const nextLessonBlockClientId = useSelect(select => {
        // Get the parent block client id of the quiz, then get the 
        const parentBlockClientId = select('core/block-editor').getBlockRootClientId(clientId);
        return select('core/block-editor').getAdjacentBlockClientId(parentBlockClientId);
    });

    // Enforce require passing on the next lesson block.
    useEffect(()=>{
        if ( true === requirePassing ) {
            console.log(nextLessonBlockClientId, 'UUID: ' + uuid);
            updateBlockAttributes(nextLessonBlockClientId, {requiresPassing: uuid});
        } else {
            updateBlockAttributes(nextLessonBlockClientId, {requiresPassing: ''});
        }
    }, [requirePassing, nextLessonBlockClientId]);

    return (
        <InspectorControls>
            <Panel>
                <PanelBody title={__(panelTitle)} initialOpen>
                    <PanelRow>
                        <TextControl
                            label="Points Required to Pass"
                            value={pointsRequiredToPass}
                            onChange={(t) =>
                                setAttributes({ pointsRequiredToPass: t })
                            }
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label="Require Passing"
                            help={
                                requirePassing
                                    ? 'Passing quiz required for user to open the next lesson.'
                                    : 'User can access next lesson without passing.'
                            }
                            checked={requirePassing}
                            onChange={() =>{
                                console.log(attributes, requirePassing);
                                setAttributes({
                                    requirePassing: !requirePassing,
                                });
                            }}
                        />
                    </PanelRow>
                </PanelBody>
            </Panel>
        </InspectorControls>
    );
};

export default Controls;
