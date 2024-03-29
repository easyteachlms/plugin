import { Collapsible, InnerBlocksWithPost } from '@easyteachlms/components';
import './style.scss';

const ALLOWED_BLOCKS = ['easyteachlms/lesson-content', 'easyteachlms/quiz'];

const edit = ({
    attributes,
    className,
    clientId,
    setAttributes,
    isSelected,
}) => {
    const { postId, lastUpdated, schedule, title, uuid } = attributes;

    const labels = {
        headerLabel: 'Start a new lesson',
        buttonLabel: 'Create lesson',
    };

    if (0 !== uuid) {
        return (
            <Collapsible
                className={className}
                title={title}
                postType="lesson"
                label="Lesson"
            >
                <InnerBlocksWithPost
                    postId={postId}
                    postType="lesson"
                    labels={labels}
                    title={title}
                    lastUpdated={lastUpdated}
                    schedule={schedule}
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
        <InnerBlocksWithPost
            postId={postId}
            postType="lesson"
            labels={labels}
            title={title}
            lastUpdated={lastUpdated}
            schedule={schedule}
            setAttributes={setAttributes}
            clientId={clientId}
            uuid={uuid}
            isSelected={isSelected}
            allowedBlocks={ALLOWED_BLOCKS}
        />
    );
};

export default edit;
