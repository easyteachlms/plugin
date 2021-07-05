/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { Dashicon } from '@wordpress/components';

const Menu = ({currentlyActive, items, onClick, setCurrentlyActive, loaded}) => {
    const { history, location } = window;
    if ( false === loaded ) {
        return <Fragment></Fragment>
    }
    return(
        <ul className="easyteach-course-outline">
            <li
            data-selected={currentlyActive.target === 'dashboard'}
            onClick={() => {
                if (history.pushState) {
                    const newUrl = addQueryArgs( location.href, { 'content-uuid': 'dashboard' } );
                    history.pushState({ path: newUrl }, '', newUrl);
                }
                setCurrentlyActive({
                    parent: false,
                    target: 'dashboard',
                    title: 'Dashboard'
                });
            }}>
                <span><Dashicon icon="admin-home" />Dashboard</span>
            </li>
            {items.map(m => {
                return(
                    <li data-selected={currentlyActive.parent === m.uuid}><span>{m.title}</span>
                        <ul>
                        {m.subItems.map(e => {
                            return(
                                <li
                                data-completed={false}
                                data-selected={currentlyActive.target === e.uuid}
                                onClick={() => onClick(e.parentUuid, e.uuid)}>
                                    <span>{'quiz' === e.type ? <Dashicon icon="editor-help" /> : <Dashicon icon="text-page" />}{e.title}</span>
                                </li>
                            );
                        })}
                        </ul>
                    </li>
                );
            })}
        </ul>
    );
}

export default Menu;