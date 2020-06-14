import { useDidMount } from '@daniakash/lifecycle-hooks';
import { Collapsible } from '@easyteachlms/components';

const Lesson = ({ title, className, uuid, children }) => {
    useDidMount(() => {});
    return (
        <Collapsible
            className={className}
            title={title}
            postType="lesson"
            defaultOpen={false}
        >
            {children}
        </Collapsible>
    );
};

export default Lesson;
