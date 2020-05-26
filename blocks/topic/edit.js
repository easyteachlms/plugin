import {
	InspectorControls,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	__experimentalBlockVariationPicker,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';

import { createBlock } from '@wordpress/blocks';
import { get, map } from 'lodash';

import Collapsible from 'components/collapsible';
import PostAsInnerBlocks from 'components/post-as-innerblocks';
import { Button } from 'semantic-ui-react';
import { __ } from '@wordpress/i18n';

// const ALLOWED_BLOCKS = ['core/paragraph'];

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
	console.log(attributes);
	const { title, id } = attributes;
   
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

	// if ( 0 !== id ) {
	// 	return(
	// 		<div>
	// 			<p>We have an existing topic! You will not be able to edit the topic because its stored in the database.</p>
	// 			<p>We will have an edit button that will open in a new window the topic editor.</p>
	// 			<p>OR we could conceivably offer the option once a topic is loaded to just copy its contents directly and we would warn the user that they're copying these contents over and we could have a small button that once again lets the user take the contents of the topic and save it </p>
	// 		</div>
	// 	);
	// }

	if ( 0 !== id && '' !== title ) {
		return(
			<Collapsible className={className} title={title} postType="topic">
				<PostAsInnerBlocks id={id} postType="topic" setAttributes={setAttributes} title={title}/>
			</Collapsible>
		)
	}

	return <PostAsInnerBlocks id={id} postType="topic" setAttributes={setAttributes} title={title}/>;
}

export default edit;