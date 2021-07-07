import './style.scss';
import { __ } from '@wordpress/i18n';
import { Collapsible, InnerBlocksWithPost } from '@easyteachlms/components';

import Controls from './controls';

const ALLOWED_BLOCKS = ['easyteachlms/question'];

const edit = ({
    attributes,
    className,
    setAttributes,
    isSelected,
    clientId,
}) => {
    const { title, uuid } = attributes;

    const labels = {
        headerLabel: 'Add quiz to this lesson',
        buttonLabel: 'Add quiz',
    };

    if (0 !== uuid) {
        return (
            <Collapsible className={className} title={title} label="Quiz">
                <InnerBlocksWithPost
                    title={title}
                    labels={labels}
                    setAttributes={setAttributes}
                    clientId={clientId}
                    uuid={uuid}
                    isSelected={isSelected}
                    allowedBlocks={ALLOWED_BLOCKS}
                />
                <Controls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    clientId={clientId}
                />
            </Collapsible>
        );
    }

    return (
        <InnerBlocksWithPost
            title={title}
            labels={labels}
            setAttributes={setAttributes}
            clientId={clientId}
            uuid={uuid}
            isSelected={isSelected}
            allowedBlocks={ALLOWED_BLOCKS}
        />
    );
};

export default edit;
