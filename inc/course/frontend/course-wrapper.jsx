/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState, Fragment, RawHTML } from '@wordpress/element';
import { Card, CardBody, CardHeader, CardFooter, Flex, FlexBlock, FlexItem } from '@wordpress/components';
import { addQueryArgs, getQueryArg } from '@wordpress/url';
 
/**
 * Internal Dependencies
 */
import './style.scss';
import Dashboard from './dashboard';
import Menu from './menu';
import Quiz from './quiz';
import Toolbar from './toolbar';
 
const CourseWrapper = ({courseId, userId, children}) => {
    const [loaded, toggleLoaded] = useState(false);
    const [studentInfo, setStudentInfo] = useState(false);
    const [courseInfo, setCourseInfo] = useState({});
    const [menuItems, setMenuItems] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(false);
    const [currentlyActive, setCurrentlyActive] = useState({parent: false, target: false, title: false, type: false});

    // Construct a menu/outline from the course data structure
    // Get the users info after this??
    useEffect(()=>{
        apiFetch({
            path: `/easyteachlms/v4/student/get/?userId=${userId}&courseId=${courseId}`,
            method: 'GET',
        }).then( e => {
            setStudentInfo({...e.data[courseId].data});
        });

        apiFetch({
            path: `/easyteachlms/v4/course/get/?courseId=${courseId}&userId=${userId}&includeContent=true`,
        }).then(res => {
            console.log('Response:', res);
            setCourseInfo({
                description: res.description,
                scoring: res.scoring,
                files: res.files,
                raw: res,
            });

            const items = [];

            const {outline} = res;
            const {structured} = outline;
            const lessons = Object.keys(structured);
            
            lessons.forEach(parentUuid => {
                let parentActive = false;
                const subItems = [];
                const subs = Object.keys(structured[parentUuid].outline);
                subs.forEach(childUuid => {
                    const {title, type} = structured[parentUuid].outline[childUuid];
                    subItems.push({
                        parentUuid: parentUuid,
                        title: title,
                        type: type,
                        uuid: childUuid,
                    });
                });
                
                items.push({
                    subItems,
                    title: structured[parentUuid].title,
                    uuid: parentUuid,
                });
            });
            
            setMenuItems(items);
        });
    }, []);

    const getMatchedItem = (uuid) => {
        if ( 'dashboard' === uuid) {
            return false;
        }
        let matchedItem = false;
        menuItems.forEach((e) => {
            e.subItems.forEach(f => {
                if ( f.uuid === uuid ) {
                    matchedItem = f;
                }
            });
        });
        return matchedItem;
    }

    const getQuizData = (uuid) => {
        return courseInfo.raw.outline.flat.find(o => o.uuid === uuid);
    }

    const handleInitLoad = () => {
        // Check for currently active content uuid on load.
        const queryArgUuid = getQueryArg(window.location.href, 'content-uuid');
        const {title, type, uuid, parentUuid} = getMatchedItem(queryArgUuid);
        console.log('handleInitLoad', queryArgUuid, uuid);
        if ( undefined !== queryArgUuid && queryArgUuid === uuid ) {
            setCurrentlyActive({
                target: uuid,
                title: title,
                parent: parentUuid,
                type: type,
            });
        } else {
            // Fall back to dashboard.
            setCurrentlyActive({
                target: 'dashboard',
                title: 'Dashboard',
                parent: false,
                type: 'dashboard',
            });
        }
        toggleLoaded(true);
    }

    useEffect(()=>{
        console.log("Menu Items?", menuItems);
        if ( 0 !== menuItems.length ) {
            handleInitLoad();
        }
    },[menuItems]);

    const handleDomChange = (parentUuid, targetUuid)=> {
        console.log('handleDomChange', parentUuid, targetUuid);
        if ( false !== currentlyActive.target ) {
            document.querySelectorAll('.wp-block-easyteachlms-course [data-active="true"]').forEach(e => {
                e.setAttribute('data-active', 'false');
            });
        }
        
        const parentElm = document.querySelector('[data-uuid="'+parentUuid+'"]');
        const targetElm = document.querySelector('[data-uuid="'+targetUuid+'"]');
        if ( parentElm ) {
            parentElm.setAttribute('data-active', 'true');
        }    
        if ( targetElm ) {
            targetElm.setAttribute('data-active', 'true');
        }
    }

    const handleUrlChange = targetUuid => {
        const { history, location } = window;
        console.log('handleUrlChange', location.href, targetUuid);
        if (history.pushState) {
            const newUrl = addQueryArgs( location.href, { 'content-uuid': targetUuid } );
            console.log('newUrl', newUrl);
            history.pushState({ path: newUrl }, '', newUrl);
        }
    }

    const handleMenuClick = (parentUuid, targetUuid) => {
        console.log('menuHandleClick', parentUuid, targetUuid, menuItems);
        if ( currentlyActive.target !== targetUuid ) {
            const matchedItem = getMatchedItem(targetUuid);
            setCurrentlyActive({
                parent: parentUuid,
                target: targetUuid,
                title: matchedItem.title,
                type: matchedItem.type,
            });
            handleUrlChange(targetUuid);
        }
    }

    /**
     * Handle Dom Changes
     */
    useEffect(()=>{
        console.log("currentlyActive?", currentlyActive);
        if ( false !== currentlyActive.target ) {
            handleDomChange(currentlyActive.parent, currentlyActive.target);
        }
    },[currentlyActive]);

    /**
     * Handle Quiz Changes
     */
    useEffect(()=>{
        if ( false !== currentlyActive.target ) {
            if ( 'quiz' === currentlyActive.type && 0 !== courseInfo.length ) {
                setActiveQuiz( getQuizData(currentlyActive.target) );
            }
        }
    },[courseInfo, currentlyActive]);

    /**
     * Handle Student Info
     */
    useEffect(()=>{
        if ( false !== studentInfo ) {
            const allDates = Object.keys(studentInfo['lesson-content-complete']);
            // Go through all dates, get the array columns
            console.log('studentInfo?', allDates.map(Number));
            const newestDate = Math.max(...allDates.map(Number));
            console.log('newestDate?', newestDate);
        }
    }, [studentInfo]);

    const CardTitle = () => {
        return(
            <CardHeader>
                <h3>{currentlyActive.title}</h3>
            </CardHeader>
        );
    }

    return(
        <Flex align="flex-start">
            <FlexItem className="menu">
                <Card>
                    <CardBody>
                        <Menu currentlyActive={currentlyActive} items={menuItems} onClick={handleMenuClick} setCurrentlyActive={setCurrentlyActive} loaded={loaded}/>
                    </CardBody>
                </Card>
            </FlexItem>
            <FlexBlock className="content">
                <Card>
                    {false !== loaded && (
                        <Fragment>
                            {false !== currentlyActive.title && <CardTitle/>}
                            <CardBody>
                                {'dashboard' === currentlyActive.target && (
                                    <Dashboard courseInfo={courseInfo}/>
                                )}
                                <RawHTML>{children}</RawHTML>
                                {'quiz' === currentlyActive.type && (
                                    <Quiz uuid={currentlyActive.target} userId={userId} courseId={courseId} data={activeQuiz}/>
                                )}
                            </CardBody>
                            {!['dashboard', 'quiz', false].includes(currentlyActive.type) && (
                                <CardFooter>
                                    <Toolbar
                                        userId={userId}
                                        courseId={courseId}
                                        uuid={currentlyActive.target}
                                        type={currentlyActive.type}
                                    />
                                </CardFooter>
                            )}
                        </Fragment>
                    )}
                </Card>
            </FlexBlock>
        </Flex>
    );
}

export default CourseWrapper;