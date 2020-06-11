import {
    Fragment,
    RawHTML,
    Children,
    isValidElement,
    cloneElement,
} from '@wordpress/element';

import { Button } from 'semantic-ui-react';
import Quiz from './quiz';

const blockController = (children, data, fn) => {
    return Children.map(children, (child) => {
        if (!isValidElement(child)) {
            return <RawHTML>{child}</RawHTML>;
        }

        if (child.props.children) {
            child = cloneElement(child, {
                children: blockController(child.props.children, data, fn),
            });
        }

        // Class Name is so important for us we need to double check it. All of our logic is based on class names.
        const { className } = child.props;
        if (undefined === className) {
            return child;
        }

        // We can do checks here
        if (className.includes('wp-block-easyteachlms-topic')) {
            return (
                <div>
                    <Fragment>
                        <h3>Topic:</h3>
                        {child}
                        <Button
                            onClick={() => {
                                console.log('COMPLETED');
                            }}
                        >
                            Mark as Completed
                        </Button>
                    </Fragment>
                </div>
            );
        }

        if (className.includes('wp-block-easyteachlms-quiz')) {
            const qProps = child.props;
            qProps.data = data.quizzes[child.props.id];
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

        return <Fragment>{child}</Fragment>;
    });
};

export default blockController;
