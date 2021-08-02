import { __ } from '@wordpress/i18n';
import { rawHandler } from '@wordpress/blocks';
import capitalize from './capitalize';

const replaceContent = (clientId, postId, postType, replaceInnerBlocks) => {
    if ( null === replaceInnerBlocks || undefined === replaceInnerBlocks ) {
        return false;
    }
    if ( undefined === clientId || undefined === postId || undefined === postType ) {
        return false;
    }

    
    const type = capitalize(postType);
    const post = new wp.api.models[type]( { id: postId } );

    return new Promise(resolve => {
        post.fetch().then(post => {		
            const parsedBlocks = rawHandler({HTML: post.content_raw});
            replaceInnerBlocks( clientId, parsedBlocks ).then( () => {
                resolve(post);
            } );
        });
    });
}

export default replaceContent;