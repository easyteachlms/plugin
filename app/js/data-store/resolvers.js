import actions from './actions';

const resolvers = {
    *getData(courseId) {
        console.info('Initializing the first getData fetch into data store');
        console.log(`getData(${courseId})`);
        const data = yield actions.fetchFromAPI(courseId);
        console.log(data);
        return actions.initDataFromAPI(data);
    },
};

export default resolvers;
