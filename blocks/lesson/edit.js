import {
	InspectorControls,
	InnerBlocks,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	__experimentalBlockVariationPicker,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { get, map } from 'lodash';
import { Icon } from '@wordpress/components';
import classNames from 'classnames';

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
	const [ open, setState ] = useState(true);
	console.log('open');
	console.log(open);
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
		setState(!open);
	}

    if ( hasInnerBlocks ) {
        return(
            <div className={classNames(className, { collapsed: !open })}>
				<div className="lesson-title"><Icon icon="arrow-down-alt2" onClick={collapseHandler}/><span>Lesson:</span> {title}</div>
				<div className="lesson-topics"><InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/></div>
            </div>
        )
    }
    
    return(
        <div className={className}>
			<div className="lesson-title" onClick={collapseHandler}><Icon icon="arrow-down-alt2" onClick={collapseHandler}/><span>Lesson:</span> {title}</div>
			<div className="lesson-topics"><InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/></div>
        </div>
    );
}

export default edit;