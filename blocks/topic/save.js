import { __ } from '@wordpress/i18n';
import { PostAsInnerBlocks } from 'components';

const save = ({ attributes, className, clientId }) => {
	const { title, lastUpdated, id } = attributes;
    return(
        <div className={className}>
            <PostAsInnerBlocks id={id} postType="topic" title={title} lastUpdated={lastUpdated} setAttributes={false} clientId={clientId}/>
        </div>
    );
}

export default save;