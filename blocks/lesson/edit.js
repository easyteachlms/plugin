import { Collapsible, PostAsInnerBlocks } from '@easyteachlms/components';

const ALLOWED_BLOCKS = ['easyteachlms/lesson-content'];

const edit = ({
    attributes,
    className,
    clientId,
    setAttributes,
    isSelected,
}) => {
    const { postId, lastUpdated, title, uuid } = attributes;

    const labels = {
        headerLabel: 'Start a new lesson',
        buttonLabel: 'Create lesson',
    };

    if (0 !== uuid) {
        return (
            <Collapsible className={className} title={title} postType="lesson">
                <PostAsInnerBlocks
                    postId={postId}
                    postType="lesson"
                    labels={labels}
                    title={title}
                    lastUpdated={lastUpdated}
                    setAttributes={setAttributes}
                    clientId={clientId}
                    uuid={uuid}
                    isSelected={isSelected}
                    allowedBlocks={ALLOWED_BLOCKS}
                />
            </Collapsible>
        );
    }

    return (
        <PostAsInnerBlocks
            postId={postId}
            postType="lesson"
            labels={labels}
            title={title}
            lastUpdated={lastUpdated}
            setAttributes={setAttributes}
            clientId={clientId}
            uuid={uuid}
            isSelected={isSelected}
            allowedBlocks={ALLOWED_BLOCKS}
        />
    );
};

export default edit;
