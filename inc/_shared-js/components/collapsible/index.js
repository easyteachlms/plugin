/**
 * External Dependencies
 */
import classNames from 'classnames';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Toolbar, ToolbarButton } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

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

    const blockProps = useBlockProps({
        className: classNames(className)
    });

    return (
        <div {...blockProps}>
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
