/**
 * WordPress Dependencies
 */
import { Fragment, useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { Dashicon } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { useCourse } from './context';

const Icon = ({type, complete}) => {   
    if ( complete ) {
        return <Dashicon icon="yes-alt"/>
    }
    return 'quiz' === type ? <Dashicon icon="editor-help" /> : <Dashicon icon="text-page" />;
}

const Menu = () => {
    const {
        currentlyActive,
        menuItems,
        userCompleted,
        handleMenuClick,
        setCurrentlyActive,
        loaded
    } = useCourse();

    const [items, setItems] = useState(false);

    const { history, location } = window;

    useEffect(()=>{
        console.log("Detected Changes", currentlyActive, userCompleted);
        const newItems = menuItems.map(m => {
            return {
                title: m.title,
                active: currentlyActive.parent === m.uuid,
                subs: m.subItems.map(e => {
                    return {
                        title: e.title,
                        active: currentlyActive.target === e.uuid,
                        uuid: e.uuid,
                        parentUuid: e.parentUuid,
                        type: e.type,
                        complete: userCompleted.includes(e.uuid),
                    }
                })
            }
        });
        console.log('newItems', newItems);
        setItems([...newItems]);
    },[userCompleted, currentlyActive, menuItems]);

    if ( false === loaded || false === items ) {
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
                    title: 'Dashboard',
                    type: 'dashboard'
                });
            }}>
                <span><Dashicon icon="admin-home" />Dashboard</span>
            </li>
            {items.map(m => {
                return(
                    <li data-selected={m.active}><span><span>{m.title}</span></span>
                        <ul>
                        {m.subs.map(e => {
                            return(
                                <li
                                    data-selected={e.active}
                                    onClick={() => handleMenuClick(e.parentUuid, e.uuid)}
                                >
                                    <span><Icon type={e.type} complete={e.complete}/><span>{e.title}</span></span>
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