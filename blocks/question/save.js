import { InnerBlocks, RichText } from '@wordpress/block-editor';

const save = ({attributes, className}) => {
    const { question, type, explanation, picture } = attributes;
    return (
        <div className={className} data-type={type} data-explanation={explanation}>
            <RichText.Content
                tagName="div"
                value={ question }
            />
            <InnerBlocks.Content/>
        </div>
    );
}

export default save;