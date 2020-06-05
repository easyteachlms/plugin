// HOC that maintains a connection to a external post

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';

import InitialState from './initial-state';
import Controls from './controls';
 
// if id === 0 then display the block initial state
// if id === 1 then display normal but offer an option to save as post
// if id is something else then actually check if the post exists and offer the updates and all that. 

const PostAsInnerBlocks = ({
	id,
	postType,
	title,
	lastUpdated,
	clientId,
	setAttributes = false,
	className = '',
	allowedBlocks = null
}) => {
	if ( 0 !== id ) {
		return(
			<Fragment>
				{ false !== setAttributes && (
					<Fragment>
						<InnerBlocks allowedBlocks={allowedBlocks}/>
						<Controls id={id} postType={postType} title={title} lastUpdated={lastUpdated} clientId={clientId} setAttributes={setAttributes}/>
					</Fragment>
				) }
				{ false === setAttributes && <InnerBlocks.Content/> }
			</Fragment>
		 );
	}

	return <InitialState postType={postType} setAttributes={setAttributes} className={className} clientId={clientId}/>; 
}

export default PostAsInnerBlocks;