import { __ } from '@wordpress/i18n';
import Certificate from './component';
import { InnerBlocks } from '@wordpress/block-editor';

const save = ({
    attributes,
    className,
}) => {
    const { uuid, backgroundColor, borderColor } = attributes; 
    return (
        <Certificate backgroundColor={backgroundColor} borderColor={borderColor} display={true} className={className}>
            <InnerBlocks.Content/>
        </Certificate>
    );
};

export default save;
