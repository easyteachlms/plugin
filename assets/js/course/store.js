import { registerStore } from '@wordpress/data';

const DEFAULT_STATE = {
    active: false,
    data: false,
};

const actions = {
    setActive(uuid) {
        const { history } = window;
        if (history.pushState) {
            const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?uuid=${uuid}`;
            window.history.pushState({ path: newurl }, '', newurl);
        }
        return {
            type: 'SET_ACTIVE',
            uuid,
        };
    },
};

const selectors = {
    getActive(state) {
        // If propert exists in state.
        const { active } = state;
        return active;
    },
    getUserState(state) {
        const { userData } = state;
        return userData;
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
