const selectors = {
    getCourseId(state) {
        const { id } = state;
        return id;
    },
    getActive(state) {
        const { active } = state;
        return active;
    },
    getData(state, courseId) {
        console.log('selector::');
        console.log(`getData(${courseId})`);
        return state.data;
    },
};

export default selectors;
