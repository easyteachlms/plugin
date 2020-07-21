import { __ } from '@wordpress/i18n';
import { useDidMount } from '@daniakash/lifecycle-hooks';
import { Fragment, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { getSaveContent } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import {
    Button,
    Panel,
    PanelBody,
    PanelRow,
    TextControl,
    Snackbar,
    Dashicon,
} from '@wordpress/components';
import { replaceContent, capitalize } from '@easyteachlms/utils';

const Controls = ({
    id,
    postType,
    title,
    lastUpdated,
    clientId,
    setAttributes = false,
    isSelected,
}) => {
    const currentBlock = useSelect((select) => {
        return select('core/block-editor').getBlock(clientId);
    }, []);

    const [updated, setFlag] = useState(false);
    const [saved, setSaved] = useState(false);

    const type = capitalize(postType);

    const { hasInnerBlocks } = useSelect(
        (select) => {
            return {
                hasInnerBlocks:
                    0 < select('core/block-editor').getBlocks(clientId).length,
            };
        },
        [clientId],
    );

    const { replaceInnerBlocks } = useDispatch('core/block-editor');

    const UpdateContentButton = ({ isSmall = false }) => {
        const onClick = () => {
            replaceContent(clientId, id, postType, replaceInnerBlocks).then(
                (post) => {
                    setAttributes({ lastUpdated: post.modified_gmt });
                    setFlag(false);
                },
            );
        };
        return (
            <Button isSmall={isSmall} isPrimary onClick={() => onClick()}>
                {__('Update Content')}
            </Button>
        );
    };

    const SaveAsNewButton = ({ isSmall = false }) => {
        if (false === hasInnerBlocks) {
            return <Fragment />;
        }

        const getBlockContent = () => {
            const { attributes, innerBlocks } = currentBlock;
            return getSaveContent(
                'sethrubenstein/ghost-block',
                attributes,
                innerBlocks,
            );
        };

        const saveAsPost = () => {
            const content = getBlockContent();

            const post = new wp.api.models[type]({ title, content });

            post.save().then((post) => {
                setAttributes({
                    id: post.id,
                    lastUpdated: post.modified_gmt,
                });
                setSaved(true);
            });
        };
        return (
            <Fragment>
                <Button isSmall={isSmall} isSecondary onClick={() => saveAsPost()}>
                    {__(`Save As New ${type}`)}
                </Button>
                {/* { true === saved && (
                    <Snackbar>
                        Post published successfully.
                    </Snackbar>
                ) } */}
            </Fragment>
        );
    };

    const checkForUpdates = () => {
        if (1 === id) {
            return;
        }
        console.info('Watching for updates...');
        const post = new wp.api.models[type]({ id });
        post.fetch().then((post) => {
            console.log(post);
            if (lastUpdated !== post.modified_gmt) {
                setFlag(true);
            }
        });
    };

    /** Check for post updates */
    useDidMount(() => {
        checkForUpdates();
        setInterval(checkForUpdates, 30000);
    });

    const panelTitle = `${type} Settings`;

    return (
        <Fragment>
            {true === updated && (
                <div
                    style={{
                        fontSize: '13px',
                        fontFamily: 'sans-serif',
                        color: 'gray',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Dashicon icon="update" style={{ marginRight: '11px' }} />
                    This {type} has updated content.
                </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', }}>
                {true === updated && (
                    <div style={{marginRight: '0.8em'}}>
                        <UpdateContentButton isSmall />
                    </div>
                )}
                <div style={{flexGrow: '1'}}>
                    <SaveAsNewButton isSmall />
                </div>
                { '$0' !== lastUpdated &&  (
                    <div style={{flexBasis: '100%'}}><span style={{fontFamily: 'sans-serif', fontSize: '11px'}}><strong>Last Updated:</strong> ${lastUpdated}</span></div>
                ) }
            </div>
            <InspectorControls>
                <Panel>
                    <PanelBody title={__(panelTitle)} initialOpen>
                        <PanelRow>
                            <TextControl
                                label="Title"
                                value={title}
                                onChange={(title) => setAttributes({ title })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <TextControl label="ID" value={id} disabled />
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label="Post Type"
                                value={type}
                                disabled
                            />
                        </PanelRow>
                        {true === updated && (
                            <PanelRow>
                                <UpdateContentButton />
                            </PanelRow>
                        )}
                        <PanelRow>
                            <SaveAsNewButton />
                        </PanelRow>
                        <PanelRow>
                            <Button isLink>{__('Edit In New Window')}</Button>
                        </PanelRow>
                    </PanelBody>
                </Panel>
            </InspectorControls>
        </Fragment>
    );
};

export default Controls;
