/**
 * WordPress Dependencies
 */

import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { render, useEffect, useState, RawHTML } from '@wordpress/element';
import { Flex, FlexBlock, FlexItem } from '@wordpress/components';

import './style.scss';

const CourseWrapper = ({courseId, userId, children}) => {
    const [loaded, toggleLoaded] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [currentlyActive, setCurrentlyActive] = useState({parent: false, target: false});

    // Construct a menu/outline from the course data structure
    // Get the users info after this??
    useEffect(()=>{
        apiFetch({
            path: `/easyteachlms/v4/course/get/?courseId=${courseId}&userId=${userId}&includeContent=true`,
        }).then(res => {
            console.log('Response:', res);
            const {outline} = res;
            const {structured} = outline;
            const lessons = Object.keys(structured);
            
            const items = [];
            lessons.forEach(lesson => {
                const subItems = [];
                const subs = Object.keys(structured[lesson].outline);
                subs.forEach(s => {
                    const t = structured[lesson].outline[s];
                    subItems.push({
                        title: t.title,
                        uuid: s,
                        type: t.type,
                        active: t.active,
                    });
                });
                
                items.push({
                    title: structured[lesson].title,
                    active: structured[lesson].active,
                    subItems
                });
            });
            setMenuItems(items);
        });
    }, []);

    useEffect(()=>{
        console.log("Menu Items?", menuItems);
        if ( 0 !== menuItems.length ) {
            toggleLoaded(true);
        }
    },[menuItems]);

    return(
        <Flex align="flex-start">
            <FlexItem className="menu">
                <ul className="easyteach-course-outline">
                {false !== loaded && menuItems.map(m => {
                    return(
                        <li>{m.title}<ul>{m.subItems.map(e => {
                            return <li onClick={() => {
                                if ( currentlyActive.target !== e.uuid ) {
                                    if ( false !== currentlyActive.target ) {
                                        document.querySelector('[data-uuid="'+currentlyActive.target+'"]').setAttribute('data-active', 'false');
                                        document.querySelector('[data-uuid="'+currentlyActive.parent+'"]').setAttribute('data-active', 'false');
                                    }
                                    
                                    const targetElm = document.querySelector('[data-uuid="'+e.uuid+'"]');
                                    const parentElm = targetElm.parentElement;
                                    targetElm.setAttribute('data-active', 'true');
                                    parentElm.setAttribute('data-active', 'true');
                                    setCurrentlyActive({parent: parentElm.getAttribute('data-uuid'), target: e.uuid});
                                }
                            }}>{e.title}</li>
                        })}</ul></li>
                    );
                })}
                </ul>
            </FlexItem>
            <FlexBlock className="content">
                {false !== loaded && <RawHTML>{children}</RawHTML>}
            </FlexBlock>
        </Flex>
    );
}

domReady(() => {
    const courses = document.querySelectorAll('.wp-block-easyteachlms-course');
    courses.forEach((course) => {
        console.log(course);
        const userId = course.getAttribute('data-user-id');
        const courseId = course.getAttribute('data-course-id');
        render(<CourseWrapper userId={userId} courseId={courseId}>{course.innerHTML}</CourseWrapper>, course);
    });
});
 