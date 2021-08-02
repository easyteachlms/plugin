import { __ } from '@wordpress/i18n';
import { useSelect, dispatch } from '@wordpress/data';
import { TextControl, Toolbar } from '@wordpress/components';
import { BlockControls, useBlockProps } from '@wordpress/block-editor';

const edit = ({ attributes, clientId, setAttributes }) => {
    const { answer, isCorrect } = attributes;

    const { answersType, otherAnswers } = useSelect(
        (select) => {
            // Get the parentBlock clientId and then the parentBlock itself
            const parentClientId = select(
                'core/block-editor',
            ).getBlockParentsByBlockName(clientId, 'easyteachlms/question');
            const parentBlock = select('core/block-editor').getBlock(
                parentClientId,
            );
            // Remove this block from the list of our parent's innerblocks
            const innerBlocks = parentBlock.innerBlocks.filter((block) => {
                return block.clientId !== clientId;
            });
            return {
                answersType: parentBlock.attributes.answersType,
                otherAnswers: innerBlocks,
            };
        },
        [isCorrect],
    );

    const createControls = () => {
        const title = isCorrect ? __('Correct Answer') : __('Incorrect Answer');

        return {
            icon: 'smiley',
            title,
            isActive: isCorrect,
            onClick: () => {
                if ('multiple' === answersType) {
                    setAttributes({ isCorrect: !isCorrect });
                } else {
                    // Filter other answers to find ones that are also set to isCorrect === true
                    const otherTrueAnswers = otherAnswers.filter((block) => {
                        return true === block.attributes.isCorrect;
                    });
                    // Strip out their clientId's
                    const otherClientIds = otherTrueAnswers.map(
                        (block) => block.clientId,
                    );
                    // Set other answers with isCorrect === true to isCorrect === false
                    otherClientIds.forEach((id, index) => {
                        dispatch('core/block-editor').updateBlockAttributes(
                            id,
                            { isCorrect: false },
                        );
                    });
                    setAttributes({ isCorrect: !isCorrect });
                }
            },
        };
    };

    const blockProps = useBlockProps();

    return (
        <div {...blockProps}>
            <BlockControls>
                <Toolbar controls={[true].map(createControls)} />
            </BlockControls>
            <TextControl
                label={__('Answer')}
                value={answer}
                onChange={(a) => setAttributes({ answer: a })}
                placeholder="Answer Text Here"
            />
        </div>
    );
};

export default edit;
