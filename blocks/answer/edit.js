import { __ } from '@wordpress/i18n';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';
import { TextControl, Toolbar } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';

const edit = ({ attributes, className, clientId, setAttributes }) => {
    const { answer, isCorrect } = attributes;

    const createControls = (controls) => {
        const title = isCorrect ? 'Correct Answer' : 'Incorrect Answer';
        return {
            icon: 'smiley',
            title,
            isActive: isCorrect,
            onClick: () => setAttributes({ isCorrect: !isCorrect }),
        };
    };

    return (
        <div className={className}>
            <BlockControls>
                <Toolbar controls={[true].map(createControls)} />
            </BlockControls>
            <TextControl
                label="Answer"
                value={answer}
                onChange={(a) => setAttributes({ answer: a })}
                placeholder="Answer Text Here"
            />
        </div>
    );
};

export default edit;
