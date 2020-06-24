import selectors from './selectors';
import actions from './actions';

const resolvers = {
    *getData(courseId) {
        console.log('resolvers');
        console.log(`getData(${courseId})`);
        const data = yield actions.fetchFromAPI(courseId);
        console.log(data);
        return actions.initDataFromAPI(data);
    },
};

export default resolvers;
