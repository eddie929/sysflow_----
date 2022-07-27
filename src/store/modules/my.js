
const my = {
    state: {
        count: "",
        ceshi: {}
    },
    state1: {
        count: "",
        ceshi: {}
    },

    mutations: {
        CESHI_NUM: (state, data) => {
            state.ceshi = data
        },
        CESHI_NUM1: (state1, data) => {
            state1.ceshi = data
        },
    },

    actions: {
        ceshi({ commit, state }, data) {
            commit('CESHI_NUM', data)
        },
    }


}

export default my