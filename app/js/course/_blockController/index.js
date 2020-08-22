import {
    Fragment,
    RawHTML,
    Children,
    isValidElement,
    cloneElement,
} from '@wordpress/element';
import { select } from '@wordpress/data';
import * as moment from 'moment';

// Load Our Blocks
import Certificate from './certificate'
import General from './general';
import LessonContent from './lesson-content';
import Quiz from './quiz';

// Maps Course post_content to EasyTeach LMS block handlers.
const blockController = (children, data, style, fn) => {
    // Iterate over static HTML content
    return Children.map(children, (child) => {
        // Failover Condition:
        if (!isValidElement(child)) {
            return <RawHTML>{child}</RawHTML>;
        }

        if (child.props.children) {
            child = cloneElement(child, {
                children: blockController(child.props.children, data, fn),
            });
        }

        const uuid = child.props['data-uuid'];
        const blockData = data.outline.flat.filter(
            (block) => block.uuid === uuid,
        );

        let parentTitle = false;
        let hasQuiz = false;
        const parentUuid = false;
        if (blockData.length) {
            parentTitle = blockData[0].parentTitle;
            hasQuiz = blockData[0].hasQuiz;
        }

        // Class Name is so important for us we need to double check it. All of our logic is based on class names.
        const { className } = child.props;
        if (undefined === className) {
            return child;
        }

        if (className.includes('wp-block-easyteachlms-lesson-content')) {
            return (
                <LessonContent
                    title={child.props['data-title']}
                    className={child.props.className}
                    uuid={uuid}
                    parentTitle={parentTitle}
                    hasQuiz={hasQuiz}
                >
                    {child}
                </LessonContent>
            );
        }

        if (className.includes('wp-block-easyteachlms-quiz')) {
            return <Quiz uuid={uuid} />;
        }

        if (className.includes('wp-block-easyteachlms-certificate-date')) {
            return <p>{moment().format('MMM D, YYYY')}</p>;
        }
        if (className.includes('wp-block-easyteachlms-certificate-student')) {
            return <h4>{select('easyteachlms/course').getUserName()}</h4>;
        }

        if (className.includes('wp-block-easyteachlms-certificate')) {
            return <Certificate>{child}</Certificate>;
        }

        if (className.includes('wp-block-embed-youtube')) {
            return (
                <div>
                    <Fragment>
                        {child}
                        <hr />
                    </Fragment>
                </div>
            );
        }

        // Default to raw output if no conditions met.
        return <General>{child}</General>;
    });
};

export default blockController;
