import { __ } from '@wordpress/i18n';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { Button, Dashicon } from '@wordpress/components';
import * as moment from 'moment';
import { capitalize, replaceContent, SaveAsPostButton } from '../utils';

const PostFetchToolbar = ({
    clientId,
    postId,
    postType,
    title,
    lastUpdated,
    setAttributes,
}) => {
    if (false === postType) {
        return <Fragment />;
    }

    const [updated, setFlag] = useState(false);

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
            replaceContent(clientId, postId, postType, replaceInnerBlocks).then(
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

    const SaveAsNewButton = () => {
        if (false === hasInnerBlocks) {
            return <Fragment />;
        }

        return (
            <Fragment>
                <SaveAsPostButton
                    title={title}
                    postType={postType}
                    postId={postId}
                    clientId={clientId}
                    setAttributes={setAttributes}
                />
            </Fragment>
        );
    };

    const checkForUpdates = () => {
        if (undefined !== postId && null !== postId && 0 !== postId) {
            
            const type = capitalize(postType);
            const post = new wp.api.models[type]({ id: postId });
            post.fetch().then((post) => {
                
                if (lastUpdated !== post.modified_gmt) {
                    setFlag(true);
                }
            });
        }
    };

    useEffect(() => {
        checkForUpdates();
        setInterval(checkForUpdates, 60000);
    }, []);

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
                    This {postType} has updated content.
                </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {true === updated && (
                    <Fragment>
                        <div style={{ marginRight: '0.8em' }}>
                            <UpdateContentButton isSmall />
                        </div>
                    </Fragment>
                )}
                {'' !== lastUpdated && (
                    <div style={{ flexBasis: '100%' }}>
                        <span
                            style={{
                                fontFamily: 'sans-serif',
                                fontSize: '11px',
                            }}
                        >
                            <strong>Last Updated:</strong>{' '}
                            {formatDate(lastUpdated)}
                        </span>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default PostFetchToolbar;
