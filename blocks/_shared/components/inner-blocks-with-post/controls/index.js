import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { Panel, PanelBody, PanelRow, TextControl } from '@wordpress/components';
import PostFetchToolbar from './post-fetch-toolbar';

const Controls = ({
    postId,
    postType,
    title,
    lastUpdated,
    clientId,
    setAttributes = false,
}) => {
    return (
        <Fragment>
            <InspectorControls>
                <Panel>
                    <PanelBody title={__('Settings')} initialOpen>
                        <PanelRow>
                            <TextControl
                                label="Title"
                                value={title}
                                onChange={(t) => setAttributes({ title: t })}
                            />
                        </PanelRow>
                        {false !== postType && (
                            <Fragment>
                                <PanelRow>
                                    <TextControl
                                        label="ID"
                                        value={postId}
                                        disabled
                                    />
                                </PanelRow>
                                <PanelRow>
                                    <TextControl
                                        label="Post Type"
                                        value={postType}
                                        disabled
                                    />
                                </PanelRow>
                            </Fragment>
                        )}
                    </PanelBody>
                </Panel>
            </InspectorControls>

            <PostFetchToolbar
                clientId={clientId}
                postType={postType}
                postId={postId}
                title={title}
                lastUpdated={lastUpdated}
                setAttributes={setAttributes}
            />
        </Fragment>
    );
};

export default Controls;
