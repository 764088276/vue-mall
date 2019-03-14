<template>
  <div id="app">
    <!--<mock-search-bar></mock-search-bar>-->
    <tab-bar></tab-bar>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import tabBar from 'components/tabbar/tab-bar'

  import {mapActions} from 'vuex'

  import {formateShopCartGood} from 'getData/shopCart/getShopCartGood'

  import CartItem from 'baseClass/good/cartItem'

  export default {
    name: 'App',
    components: {
      tabBar
    },
    created() {
      this._getShopCartList();

    },
    methods: {
      ...mapActions({
        _setShopList: 'setShopList'
      }),
      //获取购物车商品列表，并放入vuex
      _getShopCartList() {
        formateShopCartGood().then(shopCartList => {
          this._setShopList(shopCartList);
        })
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @import 'assets/less/app.less';
</style>
