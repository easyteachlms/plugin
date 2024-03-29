import { __ } from '@wordpress/i18n';
import { Collapsible, InnerBlocksWithPost } from '@easyteachlms/components';

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
        buttonLabel: 'Add content',
    };

    if (0 !== uuid) {
        return (
            <Collapsible className={className} title={title} label="Content" defaultOpen={true}>
                <InnerBlocksWithPost
                    title={title}
                    labels={labels}
                    setAttributes={setAttributes}
                    clientId={clientId}
                    uuid={uuid}
                    isSelected={isSelected}
                    template={[
                        [ 'core/paragraph', { placeholder: __('Content here...', 'elms-lesson-content-placeholder') } ],
                    ]}
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
            template={[
                [ 'core/paragraph', { placeholder: __('Content here...', 'elms-lesson-content-placeholder') } ],
            ]}
        />
    );
};

export default edit;
