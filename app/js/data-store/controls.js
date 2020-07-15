import apiFetch from '@wordpress/api-fetch';

const controls = {
    FETCH_FROM_API(action) {
        const userId = window.userData.id;
        console.log('FETCH_FROM_API');
        console.log(userId);
        return apiFetch({
            path: `/easyteachlms/v3/course/get/?courseId=${action.courseId}&userId=${userId}`,
        });
    },
};

export default controls;
