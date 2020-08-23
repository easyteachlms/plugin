import { rawHandler } from '@wordpress/blocks';

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

export { capitalize, replaceContent };
