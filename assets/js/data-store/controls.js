import apiFetch from '@wordpress/api-fetch';

const controls = {
    FETCH_FROM_API(action) {
        return apiFetch({
            path: `/easyteachlms/v3/course/get/?courseId=${action.courseId}`,
        });
    },
};

export default controls;
