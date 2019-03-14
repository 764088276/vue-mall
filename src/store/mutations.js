import * as type from './mutation_types'

const mutations = {
  [type.SET_CART_LIST](state, param) {
    state.shopCartList = param
  },
  [type.SET_CART_NUM](state, param) {
    state.shopCartNum = param
  }
};

export default mutations
