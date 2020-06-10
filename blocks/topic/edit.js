import { __ } from '@wordpress/i18n';
import { Collapsible, PostAsInnerBlocks } from '@easyteachlms/components';

const edit = ({ attributes, className, clientId, setAttributes }) => {
	const { title, lastUpdated, id } = attributes;

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