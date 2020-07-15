import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Panel, PanelBody, PanelRow, TextControl } from '@wordpress/components';

const Controls = ({ attributes, setAttributes }) => {
    const panelTitle = 'Quiz Settings';
    const { title } = attributes;

    return (
        <InspectorControls>
            <Panel>
                <PanelBody title={__(panelTitle)} initialOpen>
                    <PanelRow>
                        <TextControl
                            label="Quiz Title"
                            value={title}
                            onChange={(t) => setAttributes({ title: t })}
                        />
                    </PanelRow>
                </PanelBody>
            </Panel>
        </InspectorControls>
    );
};

export default Controls;
