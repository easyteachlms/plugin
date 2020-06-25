const actions = {
    fetchFromAPI(courseId, userId) {
        return {
            type: 'FETCH_FROM_API',
            courseId,
            userId,
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
    setComplete(uuid) {
        return {
            type: 'SET_COMPLETE',
            uuid,
        };
    },
};

export default actions;
