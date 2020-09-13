// HOC that maintains a connection to a external post

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InnerBlocks as WPInnerBlocks } from '@wordpress/block-editor';

import InitialState from './initial-state';
import Controls from './controls';

const ButtonBlockAppender = (props) => {
    return <WPInnerBlocks.ButtonBlockAppender {...props} />;
};

const InnerBlocksWithPost = ({
    title,
    labels,
    uuid,
    postId,
    postType = false,
    lastUpdated,
    className = '',
    clientId,
    isSelected = false,
    setAttributes = false,
    allowedBlocks,
    renderAppender,
    orientation,
    __experimentalCaptureToolbars = false,
}) => {
    // Explicitly, if no setAttributes is passed or false is speciically passed treat this as "save" mode and only display content.
    if (false === setAttributes) {
        return <WPInnerBlocks.Content />;
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
                    <WPInnerBlocks
                        allowedBlocks={allowedBlocks}
                        // renderAppender={
                        //     false === postType
                        //         ? renderAppender
                        //         : () => <ButtonBlockAppender />
                        // }
                        renderAppender={() => <ButtonBlockAppender />}
                        orientation={orientation}
                        __experimentalCaptureToolbars={
                            __experimentalCaptureToolbars
                        }
                    />
                    <Controls
                        title={title}
                        postId={postId}
                        postType={postType}
                        lastUpdated={lastUpdated}
                        clientId={clientId}
                        setAttributes={setAttributes}
                        isSelected={isSelected}
                    />
                </Fragment>
            )}
        </Fragment>
    );
};

export { InnerBlocksWithPost, ButtonBlockAppender };
export default InnerBlocksWithPost;
