import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { rawHandler } from '@wordpress/blocks';

const LoadExample = ({ courseClientId, template = 'HTML TEMPLATE' }) => {
    const [processing, toggleProcessing] = useState(false);

    const { replaceInnerBlocks } = useDispatch('core/block-editor');

    const replaceHandler = () => {
        toggleProcessing(true);
        setTimeout(() => {
            const parsedBlocks = rawHandler({ HTML: template });
            replaceInnerBlocks(courseClientId, parsedBlocks).then(() => {
                toggleProcessing(false);
            });
        }, 1000);
    };

    return (
        <Button
            isSecondary
            isBusy={processing}
            onClick={() => {
                replaceHandler();
            }}
        >
            Import Now
        </Button>
    );
};

export default LoadExample;
