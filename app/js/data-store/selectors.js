const selectors = {
    getUserId() {
        return window.userData.id;
    },
    getUserName() {
        return window.userData.name;
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
    getCertificate(state) {
        return state.certificate;
    },
    getQuestions(state, uuid) {
        const { outline } = state.data;
        const index = outline.flat.findIndex(
            (obj) => 'quiz' === obj.type && obj.uuid === uuid,
        );
        if (outline.flat[index] && outline.flat[index].questions) {
            return outline.flat[index].questions;
        }
        return false;
    },
    getPointsRequiredToPass(state, uuid) {
        const { outline } = state.data;
        const index = outline.flat.findIndex(
            (obj) => 'quiz' === obj.type && obj.uuid === uuid,
        );
        if (outline.flat[index] && outline.flat[index].pointsRequiredToPass) {
            return outline.flat[index].pointsRequiredToPass;
        }
        return false;
    },
    hasUserTakenQuiz(state, uuid) {
        const { outline } = state.data;
        const index = outline.flat.findIndex(
            (obj) => 'quiz' === obj.type && obj.uuid === uuid,
        );
        if (outline.flat[index] && outline.flat[index].userScore) {
            return outline.flat[index].userScore;
        }
        return false;
    },
    getQuiz(state, uuid) {
        const { outline } = state.data;
        const index = outline.flat.findIndex(
            (obj) => 'quiz' === obj.type && obj.uuid === uuid,
        );
        console.log('getQuiz');
        console.log(index);
        if (outline.flat[index]) {
            return outline.flat[index];
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
            if ('quiz' === obj.type) {
                r.push(obj);
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
    isLocked(state, uuid) {
        if (
            !state.data.hasOwnProperty('outline') ||
            !state.data.outline.hasOwnProperty('flat')
        ) {
            return false;
        }
        const { flat } = state.data.outline;
        const index = flat.findIndex((obj) => obj.uuid === uuid);
        return flat[index].locked;
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
