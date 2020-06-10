// Determines style selected and then proceeds to load the course correctly.
// Dives through finding the lesson block and gathering up its resources.
import { withState } from '@wordpress/compose';
import {
    Fragment,
    RawHTML,
    Children,
    isValidElement,
    cloneElement,
    render,
} from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import { Parser } from 'html-to-react';
import { Button } from 'semantic-ui-react';

// We will import raw children and then

const recursiveMap = (children, fn) => {
    return Children.map(children, (child) => {
        if (!isValidElement(child)) {
            return <RawHTML>{child}</RawHTML>;
        }

        if (child.props.children) {
            child = cloneElement(child, {
                children: recursiveMap(child.props.children, fn),
            });
        }
        console.log('child recursive');
        console.log(child);

        // Class Name is so important for us we need to double check it. All of our logic is based on class names.
        const { className } = child.props;
        if (undefined === className) {
            return child;
        }
        console.log(className);
        console.log(className.includes('wp-block-easyteachlms-topic'));
        // We can do checks here
        if (className.includes('wp-block-easyteachlms-topic')) {
            return (
                <div>
                    <Fragment>
                        <h3>Topic:</h3>
                        {child}
                        <Button>Mark as Completed</Button>
                    </Fragment>
                </div>
            );
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

const Course = withState({
    loaded: false,
})(({ loaded, setState, children }) => {
    // Note: okay so far the parser is working well. It's getting me react elements for the whole HTML string so thats good. Now we need to figure out how to loop through those elements and convert them to react and render them. Raw HTML should be used for anything that is not OURS.
    const HTMLParser = new Parser();
    const courseAsReactElement = HTMLParser.parse(children)[1];

    console.log('Course HOC');
    console.log(courseAsReactElement);
    const items = recursiveMap(courseAsReactElement);
    // parseChildren(courseAsReactElement);

    return <div className="easyteach-lms-course">{items}</div>;
});

domReady(() => {
    if (document.querySelector('.wp-block-easyteachlms-course')) {
        const elms = document.querySelectorAll('.wp-block-easyteachlms-course');
        elms.forEach((value) => {
            const children = value.innerHTML;
            render(<Course>{children}</Course>, value);
        });
    }
});
