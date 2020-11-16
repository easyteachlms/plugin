import { __ } from '@wordpress/i18n';
import { InnerBlocksWithPost } from '@easyteachlms/components';

const save = ({ attributes, className, clientId }) => {
    const { title, lastUpdated, postId, uuid } = attributes;
    return (
        <div className={className} data-title={title} data-uuid={uuid}>
            <InnerBlocksWithPost
                postId={postId}
                postType="lesson"
                title={title}
                lastUpdated={lastUpdated}
                setAttributes={false}
                clientId={clientId}
            />
        </div>
    );
};

export default save;
