import { InnerBlocks } from '@wordpress/block-editor';
import { useContext, Fragment } from '@wordpress/element';
import { Dashicon } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { get, map } from 'lodash';

import './edit.scss';

import { Tutorial, tutorialContext } from './components';

const ALLOWED_BLOCKS = ['easyteachlms/lesson'];

const edit = ({ attributes, className, clientId, name, setAttributes }) => {
    const {tutorial} = attributes;

    // We get some information when the block's internal state changes.
    const {
		hasInnerBlocks,
	} = useSelect(
		( select ) => {
			return {
				hasInnerBlocks: select( 'core/block-editor' ).getBlocks( clientId ).length > 0,
			};
		},
		[ clientId, name ]
	);

	// @TODOIf has innerblocks and some context provided tutorial finished is it set to true and or if the user has specified to never to be shown.
    if ( hasInnerBlocks || false === tutorial ) {
        return(
			<Fragment>
				<div className={className}>
					<InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/>
				</div>
			</Fragment>
        )
	}
	
	// const { SpotlightTarget } = useContext(tutorialContext);
    
    return(
		<Fragment>
			<Tutorial setAttributes={setAttributes}>
				<div className={className}>
					<InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/>
				</div>
			</Tutorial>
		</Fragment>
    );
}

export default edit;