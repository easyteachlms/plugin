const actions = {
    fetchFromAPI(courseId) {
        return {
            type: 'FETCH_FROM_API',
            courseId,
        };
    },
    initDataFromAPI(data) {
        return {
            type: 'INIT_DATA',
            data,
        };
    },
    setActive(uuid) {
        const { history, location } = window;
        const { protocol, pathname, host } = location;
        if (history.pushState) {
            const newurl = `${protocol}//${host}${pathname}?uuid=${uuid}`;
            history.pushState({ path: newurl }, '', newurl);
        }
        return {
            type: 'SET_ACTIVE',
            uuid,
        };
    },
    enroll(status) {
        console.log('enroleld');
        return {
            type: 'ENROLL',
            status,
        };
    },
    setComplete(uuid) {
        return {
            type: 'SET_COMPLETE',
            uuid,
        };
    },
};

export default actions;
