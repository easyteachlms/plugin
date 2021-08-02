/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    Panel,
    PanelBody,
    PanelRow,
    TextControl,
    TextareaControl,
    SelectControl,
} from '@wordpress/components';

const Controls = ({ attributes, setAttributes }) => {
    const panelTitle = 'Question Settings';
    const { explanation, answersType, points } = attributes;

    return (
        <InspectorControls>
            <Panel>
                <PanelBody title={__(panelTitle)} initialOpen>
                    <PanelRow>
                        <TextareaControl
                            label="Question Explanation:"
                            value={explanation}
                            onChange={(e) => setAttributes({ explanation: e })}
                            placeholder="Expand on this question, provide more background or additional information."
                        />
                    </PanelRow>
                    <PanelRow>
                        <SelectControl
                            label="Answers Type"
                            value={answersType}
                            options={[
                                {
                                    value: null,
                                    label: 'Select a answer type',
                                    disabled: true,
                                },
                                { label: 'Single', value: 'single' },
                                { label: 'Multiple', value: 'multiple' },
                                { label: 'Text', value: 'text' },
                            ]}
                            onChange={(aT) => {
                                setAttributes({ answersType: aT });
                            }}
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label="Points"
                            value={points}
                            onChange={(p) => setAttributes({ points: p })}
                        />
                    </PanelRow>
                </PanelBody>
            </Panel>
        </InspectorControls>
    );
};

export default Controls;
