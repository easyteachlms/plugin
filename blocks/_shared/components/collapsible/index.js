import { useState } from '@wordpress/element';
import classNames from 'classnames';
import { Header, Transition } from 'semantic-ui-react';
import { __ } from '@wordpress/i18n';

const Collapsible = ({
    title,
    postType,
    className,
    children,
    defaultOpen = true,
}) => {
    const [open, setState] = useState(defaultOpen);

    const collapseHandler = () => {
        setState(!open);
    };

    const caretDirection = open ? 'down' : 'right';
    // const animation = open ? 'slide down' : 'slide up';
    const animation = 'fade down';

    return (
        <div className={classNames(className, 'lmsui-collapsible')}>
            <div className="collapsible-title">
                <Header
                    as="h4"
                    icon={`caret ${caretDirection}`}
                    content={__(`${postType.toUpperCase()}:  ${title}`)}
                    onClick={collapseHandler}
                />
            </div>
            <Transition visible={open} animation={animation} duration={500}>
                <div className="collapsible-content">{children}</div>
            </Transition>
        </div>
    );
};

export default Collapsible;
