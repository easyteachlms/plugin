import {
    Fragment,
    RawHTML,
    Children,
    isValidElement,
    cloneElement,
} from '@wordpress/element';

// Load Our Block Renderers
// import Lesson from './lesson';
import Topic from './topic';
import Quiz from './quiz';

const getBlockByUUID = (data, uuid) => {
    return data.filter(function (obj) {
        return obj.uuid === uuid;
    });
};

// Maps Course post_content to EasyTeach LMS block handlers.
const blockController = (children, data, active, fn) => {
    return Children.map(children, (child) => {
        // Failover Condition:
        if (!isValidElement(child)) {
            return <RawHTML>{child}</RawHTML>;
        }

        if (child.props.children) {
            child = cloneElement(child, {
                children: blockController(
                    child.props.children,
                    data,
                    active,
                    fn,
                ),
            });
        }

        const uuid = child.props['data-uuid'];

        // Class Name is so important for us we need to double check it. All of our logic is based on class names.
        const { className } = child.props;
        if (undefined === className) {
            return child;
        }

        if (className.includes('wp-block-easyteachlms-topic')) {
            return (
                <Topic
                    title={child.props['data-title']}
                    className={child.props.className}
                    uuid={uuid}
                >
                    {child}
                </Topic>
            );
        }

        if (className.includes('wp-block-easyteachlms-quiz')) {
            const qProps = child.props;
            qProps.data = data.quizzes[child.props.id];
            qProps.uuid = uuid;
            return <Quiz {...qProps} />;
        }

        if (className.includes('wp-block-embed-youtube')) {
            return (
                <div>
                    <Fragment>
                        <p>
                            <strong>VIDEO HERE</strong>
                        </p>
                        {child}
                        <hr />
                    </Fragment>
                </div>
            );
        }

        // Default to raw output if no conditions met.
        return <Fragment>{child}</Fragment>;
    });
};

export default blockController;
