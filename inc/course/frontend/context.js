import {
    useState,
    useEffect,
    useContext,
    createContext,
} from '@wordpress/element';
import { addQueryArgs, getQueryArg } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

const courseContext = createContext();

// Provider hook that creates auth object and handles state
const useProvideUserData = (courseId, userId) => {
    const [loaded, toggleLoaded] = useState(false);
    const [courseData, setCourseData] = useState(false);
    const [courseDescription, setCourseDescription] = useState(false);
    const [certificate, setCertificate] = useState(false);
    
    const [userCompleted, setCompleted] = useState([]);
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [total, setTotal] = useState(0);
    const [scoring, setScoring] = useState(false);
    const [files, setFiles] = useState(false);
    const [userData, setUserData] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [currentlyActive, setCurrentlyActive] = useState({
        parent: false,
        target: false,
        title: false,
        type: false
    });

    const initCourseData = () => {
        apiFetch({
            path: `/easyteachlms/v4/course/get/?courseId=${courseId}&userId=${userId}`,
        }).then(res => {
            // Construct Course Data:
            setCourseData(res);
            setTotal(res.outline.total);
            setFiles(res.files);
            setScoring(res.scoring);
            setCourseDescription(res.description);
            setCertificate(res.certificate);

            // Construct Menu Items:
            const items = [];
            const {outline} = res;
            const {structured} = outline;
            const lessons = Object.keys(structured);
            
            lessons.forEach(parentUuid => {
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
                    requiresPassing: structured[parentUuid].requiresPassing,
                });
            });
            
            setMenuItems(items);
        });
    }

    const initUserData = () => {
        apiFetch({
            path: `/easyteachlms/v4/student/get-progress/?userId=${userId}&courseId=${courseId}`,
            method: 'GET',
        }).then( e => {
            // In this case we do not want all the raw user data, we just want the most recent data.
            const tmp = e;
            tmp.data = e.data[courseId].mostRecent;
            setUserData(tmp);
        });
    }

    const getMenuItem = (uuid) => {
        if ( 'dashboard' === uuid) {
            return false;
        }
        let matchedItem = false;
        menuItems.forEach((e) => {
            if ( e.uuid === uuid ) {
                matchedItem = e;
            }
            e.subItems.forEach(f => {
                if ( f.uuid === uuid ) {
                    matchedItem = f;
                }
            });
        });
        return matchedItem;
    }

    const handleDomChange = (parentUuid, targetUuid)=> {
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
        if (history.pushState) {
            const newUrl = addQueryArgs( location.href, { 'content-uuid': targetUuid } );
            history.pushState({ path: newUrl }, '', newUrl);
        }
    }

    const handleMenuClick = (parentUuid, targetUuid) => {
        if ( currentlyActive.target !== targetUuid ) {
            const matchedItem = getMenuItem(targetUuid);
            const matchedParent = getMenuItem(parentUuid);

            const { requiresPassing } = matchedParent;
            if ( false !== requiresPassing && !userCompleted.includes(requiresPassing) ) {
                alert('You must complete the quiz in the prior lesson to proceed.');
                return;
            }

            setCurrentlyActive({
                parent: parentUuid,
                target: targetUuid,
                title: matchedItem.title,
                type: matchedItem.type,
            });
            handleUrlChange(targetUuid);
        }
    }

    const loadApp = () => {
        // Check for currently active content uuid on load.
        const queryArgUuid = getQueryArg(window.location.href, 'content-uuid');
        const {title, type, uuid, parentUuid} = getMenuItem(queryArgUuid);

        if ( undefined !== queryArgUuid && queryArgUuid === uuid ) {
            const matchedParent = getMenuItem(parentUuid);
            const { requiresPassing } = matchedParent;
            if ( false !== requiresPassing && !userCompleted.includes(requiresPassing) ) {
                alert('You must complete the quiz in the prior lesson to proceed. Redirecting you to dashboard...');
                setCurrentlyActive({
                    target: 'dashboard',
                    title: 'Dashboard',
                    parent: false,
                    type: 'dashboard',
                });
                toggleLoaded(true);
                return;
            }

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

    /**
     * Initialize Course, User, and Quiz Data
     */
    useEffect(() => {
        initCourseData();
        initUserData();
    }, []);

    useEffect(()=>{
        if ( undefined === userData.data ) {
            return;
        }
        const completed = [];
        const submissions = {};
        const uuids = Object.keys(userData.data);
        console.log('userData2:', userData);

        uuids.forEach(id => {
            const actions = userData.data[id];

            const c = Object.keys(actions).filter(x => 'complete' === x);
            if ( 0 !== c.length ) {
                completed.push(id);
            }

            const quizSubmissions = Object.keys(actions).filter(x => 'quiz-submission' === x);
            console.log(quizSubmissions);
            if ( 0 !== quizSubmissions.length ) {
                console.log(userData.data[id]['quiz-submission']);
                submissions[id] = {...userData.data[id]['quiz-submission'].data};
            }
        });

        setCompleted(completed);
        setQuizAttempts(submissions);
    },[userData]);

    /**
     * Initialize App, once the menu items are built
     */
    useEffect(()=>{
        if ( 0 !== menuItems.length ) {
            loadApp();
        }
    },[menuItems]);

    /**
     * Handle Dom Changes
     */
    useEffect(()=>{
        console.log("currentlyActive?", currentlyActive);
        if ( false !== currentlyActive.target ) {
            handleDomChange(currentlyActive.parent, currentlyActive.target);
        }
    },[currentlyActive]);

    // Return the quiz state and functions
    return {
        courseId,
        userId,
        courseData,
        courseDescription,
        userData,
        menuItems,
        loaded,
        currentlyActive,
        userCompleted,
        quizAttempts,
        files,
        scoring,
        total,
        certificate,
        getMenuItem,
        handleMenuClick,
        setCurrentlyActive,
        setCompleted,
    };
};

// Provider component, wrap all your sub components to have access to quiz state.
const ProvideCourse = ({ courseId, userId, children }) => {
    const course = useProvideUserData(courseId, userId);
    return <courseContext.Provider value={course}>{children}</courseContext.Provider>;
};

// Hook to access shared state functions and state data.
const useCourse = () => {
    return useContext(courseContext);
};

export { ProvideCourse, useCourse };
export default ProvideCourse;
