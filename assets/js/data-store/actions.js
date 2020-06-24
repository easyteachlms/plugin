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
    updateProgress(uuid) {
        return {
            type: 'UPDATE_PROGRESS',
            uuid,
            success: true,
        };
        // apiFetch({
        //     path: `/easyteachlms/v3/student/update-progress/?courseId=${courseId}&uuid=${uuid}&userId=${userId}`,
        //     method: 'POST',
        //     data: { completed: true },
        // }).then((res) => {
        //     console.log(res);
        //     return {
        //         type: 'UPDATE_PROGRESS',
        //         success: true,
        //     };
        // });
    },
};

export default actions;
