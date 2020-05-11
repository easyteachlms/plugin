import {
	InspectorControls,
	InnerBlocks,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	__experimentalBlockVariationPicker,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { get, map } from 'lodash';

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

const edit = props => {
    const { attributes, className, clientId, name } = props;
	const { lessonID, title } = attributes;
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
	
	const collapseHandler = (e) => {
		e.target.parentElement.classList.toggle('collapsed');
	}

    if ( hasInnerBlocks ) {
        return(
            <div className={className}>
				<div className="lesson-title" onClick={collapseHandler}><span>Lesson:</span> {title}</div>
				<div className="lesson-topics"><InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/></div>
            </div>
        )
    }
    
    return(
        <div className={className}>
			<div className="lesson-title" onClick={collapseHandler}><span>Lesson:</span> {title}</div>
			<div className="lesson-topics"><InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/></div>
        </div>
    );
}

export default edit;