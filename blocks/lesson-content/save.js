import { __ } from '@wordpress/i18n';
import { PostAsInnerBlocks } from '@easyteachlms/components';

const save = ({ attributes, className, clientId }) => {
    const { title, lastUpdated, uuid } = attributes;
    return (
        <div className={className} data-title={title} data-uuid={uuid}>
            <PostAsInnerBlocks
                title={title}
                lastUpdated={lastUpdated}
                setAttributes={false}
                clientId={clientId}
            />
        </div>
    );
};

export default save;
