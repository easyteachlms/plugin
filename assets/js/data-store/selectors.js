const selectors = {
    getUserId() {
        return window.userData.id;
    },
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
    getQuiz(state, uuid) {
        if (!state.data.hasOwnProperty('quizzes')) {
            return false;
        }
        const { outline } = state.data;
        const index = outline.flat.findIndex(
            (obj) =>
                obj.hasQuiz &&
                obj.hasOwnProperty('quiz') &&
                obj.quiz.uuid === uuid,
        );
        console.log('getQuiz');
        console.log(index);
        if (outline.flat[index].hasOwnProperty('quiz')) {
            return outline.flat[index].quiz;
        }
        return false;
    },
    getQuizzes(state) {
        if (
            !state.data.hasOwnProperty('outline') ||
            !state.data.outline.hasOwnProperty('flat')
        ) {
            return false;
        }
        const { outline } = state.data;
        const r = [];
        console.log('getQuizzes');
        outline.flat.forEach((obj) => {
            console.log(obj);
            if (true === obj.hasQuiz) {
                r.push(obj.quiz);
            }
        });
        return r;
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
    // Check the state of a course element or user, ask in form of a grammatically correct simple question.
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
    areConditionsMet(state, uuid) {
        if (
            !state.data.hasOwnProperty('outline') ||
            !state.data.outline.hasOwnProperty('flat')
        ) {
            return false;
        }
        const { flat } = state.data.outline;
        const index = flat.findIndex((obj) => obj.uuid === uuid);
        return flat[index].conditionsMet;
    },
};

export default selectors;
