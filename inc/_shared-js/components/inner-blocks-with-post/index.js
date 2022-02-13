/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';
import { select } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import InitialState from './initial-state';
import Controls from './controls';
import _ from 'lodash';

const ButtonBlockAppender = ({clientId}) => {
    return <InnerBlocks.ButtonBlockAppender clientId={clientId} />;
};

const InnerBlocksWithPost = ({
    title,
    labels,
    uuid,
    postId,
    postType = false,
    lastUpdated,
    schedule,
    className = '',
    clientId,
    isSelected = false,
    setAttributes = false,
    allowedBlocks,
    renderAppender,
    orientation,
    template = [],
    __experimentalCaptureToolbars = false,
}) => {
    // const hasInnerSelectedBlock = select('core/block-editor').hasSelectedInnerBlock(
    //     clientId,
    //     false,
    // );
    
    // Explicitly, if no setAttributes is passed or false is speciically passed treat this as "save" mode and only display content.
    if (false === setAttributes) {
        return <InnerBlocks.Content />;
    }

    if (0 === uuid) {
        return (
            <InitialState
                labels={labels}
                postType={postType}
                className={className}
                setAttributes={setAttributes}
                clientId={clientId}
            />
        );
    }

    return (
        <Fragment>
            {false !== setAttributes && (
                <Fragment>
                    <Controls
                        title={title}
                        postId={postId}
                        postType={postType}
                        lastUpdated={lastUpdated}
                        schedule={schedule}
                        clientId={clientId}
                        setAttributes={setAttributes}
                        isSelected={isSelected}
                    />
                    <InnerBlocks
                        allowedBlocks={allowedBlocks}
                        renderAppender={() => isSelected ? <ButtonBlockAppender {...clientId}/> : false}
                        orientation={orientation}
                        __experimentalCaptureToolbars={
                            __experimentalCaptureToolbars
                        }
                        template={template}
                    />
                </Fragment>
            )}
        </Fragment>
    );
};

export { InnerBlocksWithPost, ButtonBlockAppender };
export default InnerBlocksWithPost;
