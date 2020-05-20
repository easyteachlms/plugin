import { InnerBlocks } from '@wordpress/block-editor';
import { Button } from 'semantic-ui-react';

const save = ({attributes, className}) => {
    return <div className={className}><InnerBlocks.Content/><Button size="small" color="teal" disabled>Mark Topic Completed</Button></div>
}

export default save;