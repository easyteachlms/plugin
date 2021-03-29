/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from '@wordpress/element';
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { Toolbar, ToolbarButton } from '@wordpress/components';

const Collapsible = ({
    title,
    postType = false,
    className,
    children,
    defaultOpen = true,
    label = false,
}) => {
    const [open, setState] = useState(defaultOpen);

    let labelPrefix = 'Content';
    if (false !== postType) {
        labelPrefix = postType.toUpperCase();
    }
    if (false !== label) {
        labelPrefix = label;
    }

    const collapseHandler = () => {
        setState(!open);
    };

    const toolbarStyle = {
        width: '100%',
    };
    if (false === postType) {
        toolbarStyle.border = 'none';
    }

    return (
        <div className={classNames(className, 'lmsui-collapsible')}>
            <Toolbar label="Options" style={toolbarStyle}>
                <ToolbarButton
                    icon={open ? 'arrow-down-alt2' : 'arrow-right-alt2'}
                    label={__(`${labelPrefix}: ${title}`)}
                    onClick={collapseHandler}
                >
                    <strong>{__(`${labelPrefix}: `)}</strong>&nbsp;
                    {__(` ${title}`)}
                </ToolbarButton>
            </Toolbar>
            {true === open && (
                <div className="collapsible-content">{children}</div>
            )}
        </div>
    );
};

export default Collapsible;
