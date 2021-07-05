/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { 
    __experimentalUseInnerBlocksProps as useInnerBlocksProps,
    InnerBlocks,
    RichText,
    useBlockProps,
} from '@wordpress/block-editor';
import { TextareaControl } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import Controls from './controls';
import './style.scss';

const ALLOWED_BLOCKS = ['easyteachlms/answer'];

const edit = ({ attributes, clientId, setAttributes }) => {
    const { question, answersType } = attributes;

    const blockProps = useBlockProps();
    const innerBlockProps = useInnerBlocksProps({
        style: {
            paddingLeft: '0.8em',
        }
    },{
        allowedBlocks: ALLOWED_BLOCKS,
        renderAppender: () => {
            return (
                <InnerBlocks.ButtonBlockAppender
                    clientId={clientId}
                />
            )
        }
    });

    return (
        <div {...blockProps}>
            <Controls attributes={attributes} setAttributes={setAttributes} />
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
                <div {...innerBlockProps}/>
            )}
            {'text' === answersType && (
                <TextareaControl
                    label="Text answers will not be automatically graded and admins will be required to manually score this quiz."
                    disabled
                />
            )}
        </div>
    );
};

export default edit;
