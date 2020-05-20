import {
	InspectorControls,
	InnerBlocks,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	__experimentalBlockVariationPicker,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import { useContext } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { get, map } from 'lodash';

import { Tutorial, tutorialContext } from './components';

const ALLOWED_BLOCKS = ['easyteachlms/lesson'];

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
    const {tutorial} = attributes;

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

	// @TODOIf has innerblocks and some context provided tutorial finished is it set to true and or if the user has specified to never to be shown.
    if ( hasInnerBlocks && false === tutorial ) {
        return(
            <div className={className+'lms-ui'}>
				<div className="lms-ui course-title">EasyTeach LMS Course Builder</div>
                <InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/>
            </div>
        )
	}
	
	// const { SpotlightTarget } = useContext(tutorialContext);
    
    return(
		<Tutorial setAttributes={setAttributes}>
			<div className={className}>
				<InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/>
			</div>
		</Tutorial>
    );
}

export default edit;