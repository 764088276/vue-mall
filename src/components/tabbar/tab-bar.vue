<template>
  <div class="tab-bar">
    <router-link
      v-for="(item,index) in routerLinkArr"
      :key="index"
      :to="item.url"
      tag="div"
      class="router-item">
      <div class="router-container">
        <div class="iconfont" :class="item.iconClass"></div>
        <div class="router-text">
          <span>{{item.title}}</span>
        </div>
        <span class="shop-cart-num" v-if="item.url=='/shop-cart'">{{shopCartNum}}</span>
      </div>
    </router-link>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "tab-bar",
    data() {
      return {
        routerLinkArr: [
          {title: '首页', iconClass: 'icon-index', 'url': '/index'},
          {title: '分类', iconClass: 'icon-sort', 'url': '/sort'},
          {title: '购物车', iconClass: 'icon-cart', 'url': '/shop-cart'},
          {title: '用户', iconClass: 'icon-user', 'url': '/user'}
        ]
      }
    },
    computed: {
      ...mapGetters([
        'shopCartList',
        'shopCartNum'
      ])
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import '../../assets/less/common.less';

  .tab-bar {
    width:100%;
    position: fixed;
    z-index: 100;
    bottom: 0;
    left: 0;
    background: #fff;
    color: @grayColor;
    display: flex;
    border-top: 1px solid @middleGray;

    .router-item {
      width: 25%;
      box-sizing: border-box;
      #flexStyle(center, center);
      font-size: @middleFont;
      height: 102px;
      flex-wrap: wrap;

      &.router-link-active {
        color: @defaultColor
      }

      .router-container {
        #flexStyle(center);
        flex-wrap: wrap;
        position: relative;

        .iconfont {
          font-size: 32px;
          margin-bottom: 4px;
        }
        .router-text {
          width: 100%;
          text-align: center;
        }
        .shop-cart-num {
          position: absolute;
          right: 16px;
          top: 6px;
          font-size: 16px;
          line-height: 24px;
          display: block;
          transform: translate(50%, -50%);
          padding: 0 10px;
          background: @defaultColor;
          color: #fff;
          border-radius: 20px;
        }
      }

    }
  }

</style>
