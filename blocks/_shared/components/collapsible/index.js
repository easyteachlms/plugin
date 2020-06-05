import { useState } from '@wordpress/element';
import classNames from 'classnames';
import { Header } from 'semantic-ui-react';
import { __ } from '@wordpress/i18n';
import './style.scss';

const Collapsible = ({ title, postType, className, children }) => {
	const [ open, setState ] = useState(true);
	
	const collapseHandler = (e) => {
		setState(!open);
	}
	
	let caretDirection = open ? 'down' : 'right';

	return(
        <div className={classNames(className, { collapsed: !open })}>
            <div className="collapsible-title">
                <Header as='h4' icon={"caret " + caretDirection} content={__( postType.toUpperCase() + ':  ' + title)} onClick={collapseHandler} />
            </div>
            <div className="collapsible-content">
                {children}
            </div>
        </div>
    )
}

export default Collapsible;