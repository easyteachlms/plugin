import { __ } from '@wordpress/i18n';
import { useDidMount } from "@daniakash/lifecycle-hooks";
import { Fragment, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { getSaveContent } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { 
	Button, 
	Panel, 
	PanelBody, 
	PanelRow,
	TextControl,
	Dashicon
} from "@wordpress/components";
import { replaceContent, capitalize } from 'utils';

const Controls = ({
    id,
    postType,
    title,
    lastUpdated,
    clientId,
    setAttributes = false
}) => {
    const currentBlock = useSelect( select => {
        return select( 'core/block-editor' ).getBlock( clientId );
    }, [] );
    
    const [ updated, setFlag ] = useState(false);
    const type = capitalize(postType);
    const { replaceInnerBlocks } = useDispatch('core/block-editor');

    const UpdateContentButton = ({isSmall = false}) => {
        const onClick = () =>  {
            replaceContent(clientId, id, postType, replaceInnerBlocks).then(post => {
                setAttributes({lastUpdated: post.modified_gmt});
                setFlag(false);
            });
        }
        return <Button isSmall={isSmall} isPrimary onClick={()=>onClick()}>{__('Update Content')}</Button>
    }

    const SaveAsNewButton = ({isSmall = false}) => {
        const getBlockContent = () => {
            const { attributes, innerBlocks } = currentBlock;
            return getSaveContent('sethrubenstein/ghost-block', attributes, innerBlocks);
        }
        
        const saveAsPost = () => {
            const content = getBlockContent();
        
            let post = new wp.api.models[type]( { title, content } );
        
            post.save().then((post)=> {
                setAttributes( { 
                    id: post.id,
                    lastUpdated: post.modified_gmt
                } );
            });
        }
    return <Button isSmall={isSmall} isSecondary onClick={()=>saveAsPost()}>{__('Save As New ' + type)}</Button>
    }

    const checkForUpdates = () => {
        console.info('Watching for updates...');
        if ( 1 === id ) {
            return;
        }
        let post = new wp.api.models[type]( { id } );
	
		post.fetch().then(post => {
			if ( lastUpdated !== post.modified_gmt ) {
				setFlag(true);
			}
		});
    }

    /** Check for post updates */
    useDidMount(() => {
        checkForUpdates();
		setInterval( checkForUpdates, 30000 );
	});

    const panelTitle = type + ' Settings';

    return(
        <Fragment>
            { true === updated && (
                <div style={{fontSize: '13px', fontFamily: 'sans-serif', color: 'gray', display: 'flex', alignItems: 'center'}}>
                    <Dashicon icon="update" style={{marginRight: '11px'}}/>
                    This {type} has updated content. 
                </div>
            )}
            <div style={{display: 'flex'}}>
                { true === updated && (
                    <div>
                        <UpdateContentButton isSmall={true}/>
                    </div>
                )}
                <div>
                    <SaveAsNewButton isSmall={true}/>
                </div>
            </div>
            <InspectorControls>
                <Panel>
                    <PanelBody title={__(panelTitle)}  initialOpen={ true }>
                    <PanelRow>
                            <TextControl
                                label='Title'
                                value={ title }
                                onChange={title => setAttributes({title})}
                            />
                        </PanelRow>
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
                        { true === updated && (
                            <PanelRow>
                                <UpdateContentButton/>
                            </PanelRow>
                        ) }
                        <PanelRow>
                            <SaveAsNewButton/>
                        </PanelRow>
                        <PanelRow>
                            <Button isLink>{__('Edit In New Window')}</Button>
                        </PanelRow>
                    </PanelBody>
                </Panel>
            </InspectorControls>
        </Fragment>
    )
}

export default Controls;