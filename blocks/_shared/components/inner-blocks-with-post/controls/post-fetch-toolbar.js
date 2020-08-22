import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { getSaveContent } from '@wordpress/blocks';
import { Button, Dashicon } from '@wordpress/components';
import { replaceContent, capitalize } from '@easyteachlms/utils';

const PostFetchToolbar = ({clientId, id,  postType, title, lastUpdated}) => {
    if ( false === postType ) {
        return <Fragment></Fragment>;
    }

    const currentBlock = useSelect((select) => {
        return select('core/block-editor').getBlock(clientId);
    }, []);
    const type = capitalize(postType);
    const [updated, setFlag] = useState(false);
    const [saved, setSaved] = useState(false);

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

    const formatDate = (date) => {
        return moment(date).format('MMM D, YYYY');
    };

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
            </Fragment>
        );
    };

    const checkForUpdates = () => {
        if ( undefined !== id && null !== id ) {
            console.info('Watching for updates...');
            const post = new wp.api.models[type]({ id });
            post.fetch().then((post) => {
                console.log(post);
                console.log(lastUpdated);
                console.log(post.modified_gmt);
                if (lastUpdated !== post.modified_gmt) {
                    setFlag(true);
                }
            });
        }
    };

    useEffect(()=>{
        checkForUpdates();
        setInterval(checkForUpdates, 30000);
    });

    return(
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
                { '' !== lastUpdated &&  (
                    <div style={{flexBasis: '100%'}}><span style={{fontFamily: 'sans-serif', fontSize: '11px'}}><strong>Last Updated:</strong> {formatDate(lastUpdated)}</span></div>
                ) }
            </div>
        </Fragment>
    );
}

export default PostFetchToolbar;