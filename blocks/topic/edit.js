import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

import { Collapsible, PostAsInnerBlocks } from 'components';

import { Button } from 'semantic-ui-react';

const hasBlocks = (clientId) => {
	console.log(clientId);
	// We get some information when the block's internal state changes.
	const { hasInnerBlocks } = useSelect(
		select => select( 'core/block-editor' ).getBlocks( clientId ).length > 0,
		[ clientId, name ]
	);
	return hasInnerBlocks;
}

const edit = ({ attributes, className, clientId, setAttributes }) => {
	const { title, lastUpdated, id } = attributes;
	
	// let test = hasBlocks(clientId);
	// console.log(attributes);
	// console.log("topic has inner blocks??");
	// console.log(test);

	if ( 0 !== id && '' !== title ) {
		return(
			<Collapsible className={className} title={title} postType="topic">
				{ /** Need to create a new block called topic content, it would use post as innerblocks and we would have a template on the topic block so when you insert it also inserts a topic content block internally. we could then easily use this to import and export content as we see fit. */}
				<PostAsInnerBlocks id={id} postType="topic" title={title} lastUpdated={lastUpdated} setAttributes={setAttributes} clientId={clientId}/>
			</Collapsible>
		)
	}

	return <PostAsInnerBlocks id={id} postType="topic" title={title} lastUpdated={lastUpdated} setAttributes={setAttributes} clientId={clientId}/>;
}

export default edit;