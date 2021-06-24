import { InnerBlocks } from '@wordpress/block-editor';

const save = ({ attributes, className }) => {
    const { title, uuid } = attributes;
    return (
        <div className={className} data-title={title} data-uuid={uuid}>
            <InnerBlocks.Content />
        </div>
    );
};

export default save;
