// HOC that maintains a connection to a external post

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { more } from '@wordpress/icons';
import { 
	Button, 
	Panel, 
	PanelBody, 
	PanelRow,
	TextControl
} from "@wordpress/components";
import { 
	useDispatch, 
	useSelect
} from '@wordpress/data';
import {
	InspectorControls,
	InnerBlocks,
	BlockControls,
} from '@wordpress/block-editor';

import { getSaveContent } from '@wordpress/blocks';

import {
	useState,
	useConstructor,
	useDidMount,
} from "@daniakash/lifecycle-hooks";

import InitialState from './initial-state';

/** Helper Utils */
const capitalize = (s) => {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

// OPTION 1: Update inner blocks with the contents 

const checkPostForUpdates = (id, postType, lastUpdated) => {
	const pType = capitalize(postType);
	let post = new wp.api.models[pType]( { id } );
	
	post.fetch().then(post => {
		console.log(post);
		console.log(lastUpdated);
		console.log(post.modified_gmt);
		if ( lastUpdated !== post.modified_gmt ) {
			console.log("WE ARE DIVERGENT");
		}
	});
}

const updateInnerBlocks = (newInnerBlocks) => {
	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );
	// When isSelected is true on the topic and isnt a brand new topic
	// 1. Check attributes.lastUpdated === topicPost.lastUpdated (made up variable we'll need to get that info). If so stop, otherwise proceed.
	// 2. Prompt user new content is available for this Topic would you like to load it or leave alone.
	// 3. If they select load it then go get the topicPosts postContent as a raw html string, store it as a temp variable.
	// 4. Use block editor parser https://developer.wordpress.org/block-editor/packages/packages-block-serialization-default-parser/ to transfor that html string into a list of innerBlock essentially
	// 5. Use block editor replaceInnerBLocks https://developer.wordpress.org/block-editor/data/data-core-block-editor/#replaceInnerBlocks to replace the inner blocks of this block with the innerblocks generated from step 4. 
	// 6. Update attributes.lastUpdated with the topicPost.lastUpdated value so now we signal they are in sync.
	/// Possibly??? An option to instead of update, create new (fork) the topic/lesson
}

 
// if id === 0 then display the block initial state
// if id === 1 then display normal but offer an option to save as post
// if id is something else then actually check if the post exists and offer the updates and all that. 

const PostAsInnerBlocks = ({id, postType, title, lastUpdated, clientId, setAttributes = false, className = '', allowedBlocks = null}) => {

	const currentBlock = useSelect( select => {
		return select( 'core/block-editor' ).getBlock( clientId );
	}, [] );
	
	
	const useBlockContent = () => {
		const { name, attributes, innerBlocks } = currentBlock;
		return getSaveContent('sethrubenstein/ghost-block', attributes, innerBlocks);
	}

	useDidMount(() => {
		console.log('Hi');
		console.log(id);
		console.log(currentBlock);
		// Do check for post updates here and if so then set a state flag to has updates available.
	});

	// OPTION 2: Save what you have as a brand new post, break existing links, put new links and more importantly take the current innerblocks parse them back out and send them to a posts content.
	const saveAsPost = () => {
		const pType = capitalize(postType);
		const content = useBlockContent();

		let post = new wp.api.models[pType]( { title, content } );

		post.save().then((post)=> {
			console.info("POST SAVED");
			console.log(post);
			setAttributes( { 
				id: post.id,
				lastUpdated: post.modified_gmt
			} );
		});
	}

	// @TODO we should check if has innerblocks and if not then dont displat the save button
	const Toolbar = () => {
		return(
			<div style={{display: 'flex', flexWrap: 'auto'}}>
				<div>
					<Button isSecondary onClick={()=>{saveAsPost(postType)}}>
						Save As {postType}
					</Button>
				</div>
				<div>
					<Button isSecondary onClick={()=>{checkPostForUpdates(id, postType, lastUpdated)}}>
						Check For Updates
					</Button>
				</div>
			</div>
		)
	}

	const Controls = () => {
		const type = capitalize(postType);
		const panelTitle = type + ' Settings';
		return(
			<Fragment>
				<InspectorControls>
					<Panel>
						<PanelBody title={__(panelTitle)} icon={ more } initialOpen={ false }>
							<PanelRow>
								<TextControl
									label='ID'
									value={ id }
									disabled
								/>
							</PanelRow>
							<PanelRow>
								<TextControl
									label='Post Type'
									value={ type }
									disabled
								/>
							</PanelRow>
						</PanelBody>
					</Panel>
				</InspectorControls>
				<Toolbar/>
			</Fragment>
		)
	}

	if ( 0 !== id ) {
		return(
			<Fragment>
				{ false !== setAttributes && (
					<Fragment>
						<InnerBlocks allowedBlocks={allowedBlocks}/>
						<Controls/>
					</Fragment>
				) }
				{ false === setAttributes && <InnerBlocks.Content/> }
			</Fragment>
		 );
	}

	return <InitialState postType={postType} setAttributes={setAttributes} className={className}/>; 
}

export default PostAsInnerBlocks;