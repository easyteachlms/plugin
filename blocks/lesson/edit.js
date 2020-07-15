import { v1 as uuidv1 } from 'uuid';
import { Collapsible, PostAsInnerBlocks } from '@easyteachlms/components';

const ALLOWED_BLOCKS = ['easyteachlms/topic'];

const edit = ({
    attributes,
    className,
    clientId,
    setAttributes,
    isSelected,
}) => {
    const { id, lastUpdated, title, uuid } = attributes;

    if (0 === uuid) {
        setAttributes({
            uuid: uuidv1(),
        });
    }

    if (0 !== id && '' !== title) {
        return (
            <Collapsible className={className} title={title} postType="lesson">
                {/** Need to create a new block called topic content, it would use post as innerblocks and we would have a template on the topic block so when you insert it also inserts a topic content block internally. we could then easily use this to import and export content as we see fit. */}
                <PostAsInnerBlocks
                    id={id}
                    postType="lesson"
                    title={title}
                    lastUpdated={lastUpdated}
                    setAttributes={setAttributes}
                    clientId={clientId}
                    isSelected={isSelected}
                    allowedBlocks={ALLOWED_BLOCKS}
                />
            </Collapsible>
        );
    }

    return (
        <PostAsInnerBlocks
            id={id}
            postType="lesson"
            title={title}
            lastUpdated={lastUpdated}
            setAttributes={setAttributes}
            clientId={clientId}
            isSelected={isSelected}
            allowedBlocks={ALLOWED_BLOCKS}
        />
    );
};

export default edit;
