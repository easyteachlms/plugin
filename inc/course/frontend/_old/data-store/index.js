/* eslint-disable default-case */
import { registerStore } from '@wordpress/data';

import actions from './actions';
import controls from './controls';
import selectors from './selectors';
import reducer from './reducer';
import resolvers from './resolvers';

const store = registerStore('easyteachlms/course', {
    reducer,

    actions,

    selectors,

    controls,

    resolvers,
});

export default store;
