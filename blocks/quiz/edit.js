import './edit.scss';
import { __ } from '@wordpress/i18n';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';
import { InnerBlocks } from '@wordpress/block-editor';

import { Collapsible } from '@easyteachlms/components';

import Controls from './controls';

const ALLOWED_BLOCKS = ['easyteachlms/question'];

const hasBlocks = (clientId) => {
    console.log(clientId);
    // We get some information when the block's internal state changes.
    const { hasInnerBlocks } = useSelect(
        (select) => 0 < select('core/block-editor').getBlocks(clientId).length,
        [clientId, name],
    );
    return hasInnerBlocks;
};

const edit = ({ attributes, className, clientId, setAttributes }) => {
    const { title } = attributes;

    return (
        <Collapsible className={className} title={title} postType="quiz">
            <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} />
            <Controls attributes={attributes} setAttributes={setAttributes} />
        </Collapsible>
    );
};

export default edit;
