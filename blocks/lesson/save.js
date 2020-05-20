import { InnerBlocks } from '@wordpress/block-editor';

const save = ({attributes, className}) => {
    const { title, lessonID } = attributes;
    return (
        <div className={className}>
            <h2>{title}</h2>
            <InnerBlocks.Content/>
        </div>
    );
}

export default save;