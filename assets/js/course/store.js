import { registerStore } from '@wordpress/data';
// import apiFetch from '@wordpress/api-fetch';

const DEFAULT_STATE = {
    active: 'test',
};

const actions = {
    setActive(uuid) {
        console.log('SETTING ACTIVE');
        console.log(uuid);
        return {
            type: 'SET_ACTIVE',
            uuid,
        };
    },
};

const selectors = {
    getActive(state) {
        const { active } = state;
        return active;
    },
};

registerStore('easyteachlms/course', {
    reducer(state = DEFAULT_STATE, action) {
        switch (action.type) {
            case 'SET_ACTIVE':
                return {
                    ...state,
                    active: action.uuid,
                };
        }
        return state;
    },

    actions,

    selectors,

    controls: {},

    resolvers: {
        *getActive() {
            const active = yield selectors.getActive();
            return active;
        },
    },
});
