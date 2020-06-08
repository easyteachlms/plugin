import { __ } from '@wordpress/i18n';
import { InnerBlocks, RichText } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import { withDispatch, useDispatch, useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import Controls from './controls';

const ALLOWED_BLOCKS = ['easyteachlms/answer'];

const edit = ({ attributes, className, clientId, setAttributes }) => {
    const { question, picture } = attributes;

	return(
        <Fragment>
            <Controls attributes={attributes} setAttributes={setAttributes}/>
            <div className={className}>
                <RichText
                    tagName="div"
                    value={ question }
                    onChange={ ( q ) => setAttributes( { question: q } ) }
                    style={{fontSize: '21px', fontFamily: 'sans-serif'}}
                    placeholder="Question Text Here"
                    keepPlaceholderOnFocus
                    allowedFormats={[ 'core/bold', 'core/italic' ]}
                />
                <InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/>
            </div>
        </Fragment>
    )
}

export default edit;