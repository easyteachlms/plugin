import { __ } from '@wordpress/i18n';
import { Collapsible, PostAsInnerBlocks } from '@easyteachlms/components';

const edit = ({
    attributes,
    className,
    clientId,
    setAttributes,
    isSelected,
}) => {
    const { title, uuid } = attributes;

    const labels = {
        headerLabel: 'Add content to this lesson',
        buttonLabel: 'Add content'
    };

    if (0 !== uuid) {
        return (
            <Collapsible className={className} title={title} postType="content">
                <PostAsInnerBlocks
                    title={title}
                    labels={labels}
                    setAttributes={setAttributes}
                    clientId={clientId}
                    uuid={uuid}
                    isSelected={isSelected}
                />
            </Collapsible>
        );
    }

    return (
        <PostAsInnerBlocks
            title={title}
            labels={labels}
            setAttributes={setAttributes}
            clientId={clientId}
            uuid={uuid}
            isSelected={isSelected}
        />
    );
};

export default edit;
