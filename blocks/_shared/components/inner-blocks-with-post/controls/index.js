import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
    Panel,
    PanelBody,
    PanelRow,
    TextControl,
} from '@wordpress/components';
import PostFetchToolbar from './post-fetch-toolbar';

const Controls = ({
    id,
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
                                onChange={(title) => setAttributes({ title })}
                            />
                        </PanelRow>
                        {false !== postType && (
                            <Fragment>
                                <PanelRow>
                                    <TextControl label="ID" value={id} disabled />
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
                id={id}
                title={title}
                setAttributes={setAttributes}
                lastUpdated={lastUpdated}
            />
        </Fragment>
    );
};

export default Controls;
