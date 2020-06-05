import { Collapsible, PostAsInnerBlocks } from 'components';

const ALLOWED_BLOCKS = ['easyteachlms/topic'];

const edit = ({ attributes, className, clientId, setAttributes }) => {
	const { id, lastUpdated, title } = attributes;

	if ( 0 !== id && '' !== title ) {
		return(
			<Collapsible className={className} title={title} postType="lesson">
				<PostAsInnerBlocks id={id} postType="lesson" title={title} lastUpdated={lastUpdated} setAttributes={setAttributes} allowedBlocks={ALLOWED_BLOCKS} clientId={clientId}/>
			</Collapsible>
		)
	}

	return <PostAsInnerBlocks id={id} postType="lesson" title={title} lastUpdated={lastUpdated} setAttributes={setAttributes} allowedBlocks={ALLOWED_BLOCKS} clientId={clientId}/>;

}

export default edit;