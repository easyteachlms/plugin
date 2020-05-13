import {
	InspectorControls,
	InnerBlocks,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	__experimentalBlockVariationPicker,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { Icon, Button } from '@wordpress/components';
import classNames from 'classnames';
import { get, map } from 'lodash';

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

const edit = props => {
    const { attributes, className, clientId, name } = props;
	const [ open, setState ] = useState(true);
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
	
	const collapseHandler = (e) => {
		setState(!open);
	}

    const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

    if ( hasInnerBlocks ) {
        return(
            <div className={classNames(className, { collapsed: !open })}>
				<div className="section-title"><Icon icon="arrow-down-alt2" onClick={collapseHandler}/><strong>Topic: </strong>Topic Title Here</div>
                <div className="topics-content">
					<InnerBlocks/>
					<Button>Mark Topic Completed</Button>
				</div>
            </div>
        )
    }
    
    return(
        <div className={classNames(className, { collapsed: !open })}>
			<div className="section-title"><Icon icon="arrow-down-alt2" onClick={collapseHandler}/><strong>Topic: </strong>Topic Title Here</div>
            <div className="topics-content"><InnerBlocks/></div>
        </div>
    );
}

export default edit;