import {
	InspectorControls,
	InnerBlocks,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	__experimentalBlockVariationPicker,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { get, map } from 'lodash';

import InitialState from 'components/block-initial-state';
import Collapsible from 'components/collapsible';

const ALLOWED_BLOCKS = ['easyteachlms/topic'];

const createBlocksFromInnerBlocksTemplate = ( innerBlocksTemplate ) => {
	return map(
		innerBlocksTemplate,
		( [ name, attributes, innerBlocks = [] ] ) =>
			createBlock(
				name,
				attributes,
				createBlocksFromInnerBlocksTemplate( innerBlocks )
			)
	);
};

const edit = ({ attributes, className, clientId, name, setAttributes }) => {
	const { id, title } = attributes;

    // We get some information when the block's internal state changes.
    const {
		blockType,
		hasInnerBlocks,
	} = useSelect(
		( select ) => {
			const {
				getBlockType,
			} = select( 'core/blocks' );

			return {
				blockType: getBlockType( name ),
				hasInnerBlocks:
					select( 'core/block-editor' ).getBlocks( clientId ).length >
					0,
			};
		},
		[ clientId, name ]
    );

	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

	if ( 0 !== id ) {
		return(
			<div><p>We have an existing lesson! You will not be able to edit the lesson because its stored in the database.</p><p>We will have an edit button that will open in a new window the lesson editor.</p></div>
		);
	}

	if ( 0 === id && '' !== title ) {
		return(
			<Collapsible className={className} title={title} postType="lesson">
				<InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/>
			</Collapsible>
		)
	}
    
    return <InitialState title={title} postType="lesson" setAttributes={setAttributes} className={className}/>
}

export default edit;