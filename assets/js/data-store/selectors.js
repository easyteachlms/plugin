const selectors = {
    getCourseId(state) {
        const { id } = state.data;
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
    getQuizzes(state) {
        if (!state.data.hasOwnProperty('quizzes')) {
            return false;
        }
        return state.data.quizzes;
    },
    getFiles(state) {
        if (!state.data.hasOwnProperty('files')) {
            return false;
        }
        return state.data.files;
    },
    getCompleted(state) {
        if (
            !state.data.hasOwnProperty('outline') ||
            !state.data.outline.hasOwnProperty('completed')
        ) {
            return false;
        }
        const { completed } = state.data.outline;
        return completed;
    },
    isComplete(state, uuid) {
        if (
            !state.data.hasOwnProperty('outline') ||
            !state.data.outline.hasOwnProperty('flat')
        ) {
            return false;
        }
        const { flat } = state.data.outline;
        const index = flat.findIndex((obj) => obj.uuid === uuid);
        return flat[index].completed;
    },
};

export default selectors;
