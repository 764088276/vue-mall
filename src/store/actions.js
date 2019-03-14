import * as type from './mutation_types'
import {formateShopCartGood} from '../getData/shopCart/getShopCartGood'

export const setShopList = function ({commit, state}, shopCartList) {
  commit(type['SET_CART_LIST'], shopCartList);
  let shopCartNum = 0;
  shopCartList.forEach(item => {
    shopCartNum += item.goodNum;
  });
  commit(type['SET_CART_NUM'], shopCartNum);
};
export const getShopCartList = function ({commit, state}) {
  formateShopCartGood().then(shopCartList => {
    setShopList({commit, state}, shopCartList)
  })
};
