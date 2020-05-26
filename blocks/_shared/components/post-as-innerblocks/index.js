// HOC that maintains a connection to a external post
import { Fragment } from '@wordpress/element';
import { Button } from "@wordpress/components";
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';

import {
	useState,
	useConstructor,
	useDidMount,
  } from "@daniakash/lifecycle-hooks";

import InitialState from './initial-state';

import {
	InspectorControls,
	InnerBlocks,
	BlockControls,
} from '@wordpress/block-editor';

const checkPostForUpdates = (id, postType, lastUpdated) => {
	// Go hit backbone api and get post given id
	// Get post last updated
	// Is lastUpdated here the same as last update, then dont worry about it.
}

// OPTION 1: Update inner blocks with the contents 

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

// OPTION 3: Do nothing.


// if id === 0 then display the block initial state
// if id === 1 then display normal but offer an option to save as post
// if id is something else then actually check if the post exists and offer the updates and all that. 

const PostAsInnerBlocks = ({id, postType, title, lastUpdated, setAttributes = false, className = '', allowedBlocks = null}) => {
    // Select A Post
    // What the course title is, and what course is associated with it (for courses that should be easy... or not??)
    // What the lesson title is and what the lesson post its associated with...
	// What the topic title is and what the topic post is associated with.

	useDidMount(() => {
		console.log('Hi');
		console.log(id);
	});

	// OPTION 2: Save what you have as a brand new post, break existing links, put new links and more importantly take the current innerblocks parse them back out and send them to a posts content.
	const saveAsPost = (type) => {
		const capitalize = (s) => {
			if (typeof s !== 'string') return ''
			return s.charAt(0).toUpperCase() + s.slice(1)
		}
		
		let postType = capitalize(type);
		
		let content = "Testing. Hello World!";
		// https://developer.wordpress.org/block-editor/packages/packages-blocks/#getSaveElement use this to pass the blocks innerblocks attributes in and get this out and then add to content.

		let post = new wp.api.models[postType]( { title, content } );

		post.save().then((post)=> {
			console.log(post);
			console.log(post.id);
			setAttributes( { 
				id: post.id,
				lastUpdated: post.modified_gmt
			} );
		});
	}

	const Toolbar = () => {
		return(
			<Button isSecondary onClick={()=>{saveAsPost(postType)}}>
				Save As {postType}
			</Button>
		)
	}

	if ( 0 !== id ) {
		return(
			<Fragment>
				{false !== setAttributes && (
					<InnerBlocks allowedBlocks={allowedBlocks}/>
				) }
				{false === setAttributes && (
					<InnerBlocks.Content/>
				)}
				<Toolbar/>
			</Fragment>
		 );
	}

	return <InitialState postType={postType} setAttributes={setAttributes} className={className}/>; 
}

export default PostAsInnerBlocks;