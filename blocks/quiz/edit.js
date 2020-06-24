import './edit.scss';
import { __ } from '@wordpress/i18n';
import { v1 as uuidv1 } from 'uuid';
import { InnerBlocks } from '@wordpress/block-editor';

import { Collapsible } from '@easyteachlms/components';

import Controls from './controls';

const ALLOWED_BLOCKS = ['easyteachlms/question'];

const edit = ({ attributes, className, setAttributes }) => {
    const { title, uuid } = attributes;

    if (0 === uuid) {
        setAttributes({
            uuid: uuidv1(),
        });
    }

    return (
        <Collapsible className={className} title={title} postType="quiz">
            <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} />
            <Controls attributes={attributes} setAttributes={setAttributes} />
        </Collapsible>
    );
};

export default edit;
