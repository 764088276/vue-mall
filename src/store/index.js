import vue from 'vue'
import vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import state from './state'

vue.use(vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict:debug
})
