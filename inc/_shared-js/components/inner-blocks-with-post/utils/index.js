import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { select } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { rawHandler, getSaveContent } from '@wordpress/blocks';

const { api } = window.wp;

const capitalize = (s) => {
    if ('string' !== typeof s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const replaceContent = (clientId, postId, postType, replaceInnerBlocks) => {
    if (null === replaceInnerBlocks || undefined === replaceInnerBlocks) {
        return false;
    }
    if (
        undefined === clientId ||
        undefined === postId ||
        undefined === postType
    ) {
        return false;
    }

    const type = capitalize(postType);
    const post = new api.models[type]({ id: postId });
    console.log(post);

    return new Promise((resolve) => {
        post.fetch().then((p) => {
            const parsedBlocks = rawHandler({ HTML: p.content_raw });
            console.log('parsedBlocks', parsedBlocks);
            replaceInnerBlocks(clientId, parsedBlocks).then(() => {
                resolve(p);
            });
        });
    });
};

const saveAsPost = (title, type, clientId, setAttributes, toggleLoading) => {
    toggleLoading(true);

    console.log('Saving Post');
    console.log(title);
    console.log(type);
    console.log(clientId);
    const currentBlock = select('core/block-editor').getBlock(clientId);

    const getBlockContent = () => {
        const { attributes, innerBlocks } = currentBlock;
        return getSaveContent(
            'easyteachlms/ghost-block',
            attributes,
            innerBlocks,
        );
    };

    const content = getBlockContent();

    const post = new api.models[type]({ title, content });

    post.save().then((p) => {
        toggleLoading(false);
        setAttributes({
            postId: p.id,
            lastUpdated: p.modified_gmt,
        });
    });
};

const SaveAsPostButton = ({
    title,
    postType,
    postId,
    clientId,
    setAttributes,
    isSmall = false,
}) => {
    const type = capitalize(postType);
    const [loading, toggleLoading] = useState(false);

    return (
        <Button
            isSmall={isSmall}
            isSecondary
            isBusy={loading}
            disabled={0 !== postId}
            onClick={() =>
                saveAsPost(title, type, clientId, setAttributes, toggleLoading)
            }
        >
            {0 === postId && __(`Save As New ${type}`)}
            {0 !== postId && __(`${type} Saved`)}
        </Button>
    );
};

export default saveAsPost;
export { SaveAsPostButton, saveAsPost, capitalize, replaceContent };
