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
    const {
        explanation,
        type,
        answersType,
        correctAnswerMessage,
        incorrectAnswerMessage,
        points,
    } = attributes;

    const QuestionType = () => {
        return (
            <SelectControl
                label="Question Type"
                value={type}
                options={[
                    {
                        value: null,
                        label: 'Select a question type',
                        disabled: true,
                    },
                    { label: 'Text', value: 'text' },
                    { label: 'Photo', value: 'photo' },
                ]}
                onChange={(t) => {
                    setAttributes({ type: t });
                }}
            />
        );
    };

    const AnswersType = () => {
        return (
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
        );
    };

    const Points = () => {
        return (
            <TextControl
                label="Points"
                value={points}
                onChange={(p) => setAttributes({ points: p })}
            />
        );
    };

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
                        <TextControl
                            label="Correct Answer Message"
                            value={correctAnswerMessage}
                            onChange={(cAW) =>
                                setAttributes({ correctAnswerMessage: cAW })
                            }
                        />
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label="Incorrect Answer Message"
                            value={incorrectAnswerMessage}
                            onChange={(iCAW) =>
                                setAttributes({ incorrectAnswerMessage: iCAW })
                            }
                        />
                    </PanelRow>
                    <PanelRow>
                        <QuestionType />
                    </PanelRow>
                    <PanelRow>
                        <AnswersType />
                    </PanelRow>
                    <PanelRow>
                        <Points />
                    </PanelRow>
                </PanelBody>
            </Panel>
        </InspectorControls>
    );
};

export default Controls;
