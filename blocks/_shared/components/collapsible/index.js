/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from '@wordpress/element';
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';
import { Toolbar, ToolbarButton } from '@wordpress/components';
import { chevronDown, chevronRight } from '@wordpress/icons';

const Collapsible = ({
    title,
    postType = false,
    className,
    children,
    defaultOpen = true,
}) => {
    const [open, setState] = useState(defaultOpen);

    let label = 'Content';
    if (false !== postType) {
        label = postType.toUpperCase();
    }

    const collapseHandler = () => {
        setState(!open);
    };

    const style = {};
    if (false === postType) {
        style.paddingLeft = '15px';
    }

    const toolbarStyle = {
        width: '100%',
    };
    if (false === postType) {
        toolbarStyle.border = 'none';
    }

    return (
        <div
            className={classNames(className, 'lmsui-collapsible')}
            style={style}
        >
            <Toolbar label="Options" style={toolbarStyle}>
                <ToolbarButton
                    icon={open ? chevronDown : chevronRight}
                    label={__(`${label}: ${title}`)}
                    onClick={collapseHandler}
                >
                    <strong>{__(`${label}: `)}</strong> {__(` ${title}`)}
                </ToolbarButton>
            </Toolbar>
            {true === open && (
                <div className="collapsible-content">{children}</div>
            )}
        </div>
    );
};

export default Collapsible;
