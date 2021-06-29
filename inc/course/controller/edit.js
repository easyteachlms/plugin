/**
 * External Dependencies
 */


/**
 * WordPress Dependencies
 */
import { 
    useBlockProps,
    __experimentalUseInnerBlocksProps as useInnerBlocksProps,
    InnerBlocks,
} from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import Welcome from './welcome';
import Controls from './controls';
import './style.scss';

const ALLOWED_BLOCKS = ['easyteachlms/lesson', 'easyteachlms/certificate'];

const edit = ({ attributes, clientId, isSelected, setAttributes }) => {
    const { id } = attributes;

    // We get some information when the block's internal state changes.
    const { hasInnerBlocks, courseId } = useSelect(
        (select) => {
            return {
                hasInnerBlocks:
                    0 < select('core/block-editor').getBlocks(clientId).length,
                courseId: select('core/editor').getCurrentPostId(),
            };
        },
        [clientId],
    );

    const blockProps = useBlockProps();
    const innerBlockProps = useInnerBlocksProps({},{
        allowedBlocks: ALLOWED_BLOCKS,
        renderAppender: () => {
            if ( !isSelected ) {
                return false;
            }
            return (
                <InnerBlocks.ButtonBlockAppender
                    clientId={clientId}
                />
            )
        }
    });

    const setCourseID = () => {
        // Force this block to be aware of the course id of the post it is on.
        if (courseId !== id) {
            setAttributes({ id: courseId });
        }
    };

    // On block init, set courseId
    useEffect(() => {
        setCourseID();
    }, []);

    if (hasInnerBlocks) {
        return (
            <div {...blockProps}>
                <Controls
                    clientId={clientId}
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <div {...innerBlockProps}/>
            </div>
        );
    }

    return (
        <Welcome clientId={clientId} setAttributes={setAttributes}>
            <div {...innerBlockProps}/>
        </Welcome>
    );
};

export default edit;
