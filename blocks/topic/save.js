import { InnerBlocks } from '@wordpress/block-editor';

const save = ({attributes, className}) => {
    return <div className={className}><InnerBlocks.Content/><button>Mark Topic as Complete</button></div>
}

export default save;