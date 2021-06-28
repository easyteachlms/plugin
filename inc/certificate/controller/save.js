import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

const save = ({
    attributes,
    className,
}) => {
    return <InnerBlocks.Content/>
};

export default save;
