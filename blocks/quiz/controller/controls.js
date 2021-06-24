import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    Panel,
    PanelBody,
    PanelRow,
    TextControl,
    ToggleControl,
} from '@wordpress/components';

const Controls = ({ attributes, setAttributes }) => {
    const panelTitle = 'Quiz Settings';
    const { pointsRequiredToPass, requirePassing } = attributes;

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
                                    ? 'Passing quiz required to proceed to next lesson.'
                                    : 'Next lesson open.'
                            }
                            checked={requirePassing}
                            onChange={() =>
                                setAttributes({
                                    requirePassing: !requirePassing,
                                })
                            }
                        />
                    </PanelRow>
                </PanelBody>
            </Panel>
        </InspectorControls>
    );
};

export default Controls;
