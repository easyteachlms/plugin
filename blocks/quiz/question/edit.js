import { __ } from '@wordpress/i18n';
import { InnerBlocks, RichText } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { TextareaControl } from '@wordpress/components';
import Controls from './controls';

import './style.scss';

const edit = ({ attributes, className, setAttributes }) => {
    const { question, answersType } = attributes;

    const ALLOWED_BLOCKS = ['easyteachlms/answer'];

    return (
        <Fragment>
            <Controls attributes={attributes} setAttributes={setAttributes} />
            <div
                className={className}
                style={{ paddingLeft: '2em', paddingRight: '1em' }}
            >
                <RichText
                    tagName="div"
                    value={question}
                    onChange={(q) => setAttributes({ question: q })}
                    style={{ fontSize: '21px', fontFamily: 'sans-serif' }}
                    placeholder="Question Text Here"
                    keepPlaceholderOnFocus
                    allowedFormats={['core/bold', 'core/italic']}
                />
                {'text' !== answersType && (
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        renderAppender={() => (
                            <InnerBlocks.ButtonBlockAppender>
                                Add an Answer
                            </InnerBlocks.ButtonBlockAppender>
                        )}
                    />
                )}
                {'text' === answersType && (
                    <TextareaControl
                        label="Text answers will not be automatically graded and admins will be required to manually score this quiz."
                        disabled
                    />
                )}
            </div>
        </Fragment>
    );
};

export default edit;
