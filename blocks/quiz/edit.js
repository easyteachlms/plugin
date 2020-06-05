import { __ } from '@wordpress/i18n';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';
import { InnerBlocks } from '@wordpress/block-editor';

import { Collapsible } from 'components';

const hasBlocks = (clientId) => {
	console.log(clientId);
	// We get some information when the block's internal state changes.
	const { hasInnerBlocks } = useSelect(
		select => select( 'core/block-editor' ).getBlocks( clientId ).length > 0,
		[ clientId, name ]
	);
	return hasInnerBlocks;
}

const edit = ({ attributes, className, clientId, setAttributes }) => {
	const { title } = attributes;

	return(
        <Collapsible className={className} title={title} postType="quiz">
            Quiz Go Here
            <InnerBlocks/>
        </Collapsible>
    )
}

export default edit;