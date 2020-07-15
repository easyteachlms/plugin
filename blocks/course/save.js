import { InnerBlocks } from '@wordpress/block-editor';

const save = ({ attributes, className }) => {
    const { id } = attributes;
    return (
        <div className={className} data-course-id={id}>
            <InnerBlocks.Content />
        </div>
    );
};

export default save;
