// Actions, ask the store in the form of a declarative command...
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
    enroll(status) {
        return {
            type: 'ENROLL',
            status,
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
    setQuizScore(uuid, score) {
        return {
            type: 'SET_QUIZ_SCORE',
            uuid,
            score,
        };
    },
    setConditionsMet(uuid) {
        return {
            type: 'SET_CONDITIONS_MET',
            uuid,
        };
    },
    storeCertificate(markup) {
        return {
            type: 'STORE_CERTIFICATE',
            markup,
        };
    },
};

export default actions;
