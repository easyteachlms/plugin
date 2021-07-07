/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { Dashicon } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useCourse } from './context';

const Menu = () => {
    const {currentlyActive, menuItems, userCompleted, handleMenuClick, setCurrentlyActive, loaded} = useCourse();
    const { history, location } = window;
    if ( false === loaded ) {
        return <Fragment></Fragment>
    }

    console.log('userCompleted???', userCompleted);

    const Icon = ({uuid, type}) => {
        console.log("Icon", userCompleted.includes(uuid), uuid, userCompleted);
        if ( userCompleted.includes(uuid) ) {
            return <Dashicon icon="yes-alt"/>
        }
        return 'quiz' === type ? <Dashicon icon="editor-help" /> : <Dashicon icon="text-page" />;
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
            {menuItems.map(m => {
                return(
                    <li data-selected={currentlyActive.parent === m.uuid}><span>{m.title}</span>
                        <ul>
                        {m.subItems.map(e => {
                            return(
                                <li
                                    data-completed={false}
                                    data-selected={currentlyActive.target === e.uuid}
                                    onClick={() => handleMenuClick(e.parentUuid, e.uuid)}
                                >
                                    <span><Icon uuid={e.uuid} type={e.type}/> {e.title}</span>
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