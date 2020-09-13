import { __ } from '@wordpress/i18n';
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
            replaceInnerBlocks(clientId, parsedBlocks).then(() => {
                resolve(p);
            });
        });
    });
};

const saveAsPost = (title, type, clientId, setAttributes, setSaved) => {
    console.log('Saving Post');
    console.log(title);
    console.log(type);
    console.log(clientId);
    const currentBlock = select('core/block-editor').getBlock(clientId);

    const getBlockContent = () => {
        const { attributes, innerBlocks } = currentBlock;
        return getSaveContent(
            'sethrubenstein/ghost-block',
            attributes,
            innerBlocks,
        );
    };

    const content = getBlockContent();

    const post = new api.models[type]({ title, content });

    post.save().then((p) => {
        setAttributes({
            postId: p.id,
            lastUpdated: p.modified_gmt,
        });
        if (false !== setSaved) {
            setSaved(true);
        }
    });
};

const SaveAsPostButton = ({
    title,
    postType,
    clientId,
    setAttributes,
    setSaved = false,
    isSmall = false,
}) => {
    const type = capitalize(postType);

    return (
        <Button
            isSmall={isSmall}
            isSecondary
            onClick={() =>
                saveAsPost(title, type, clientId, setAttributes, setSaved)
            }
        >
            {__(`Save As New ${type}`)}
        </Button>
    );
};

export default saveAsPost;
export { SaveAsPostButton, saveAsPost, capitalize, replaceContent };
