<template>
  <transition name="slide">
    <div class="page-container with-pagetitle" v-if="true">
      <page-title title="订单列表"></page-title>
      <div class="order-list-container" v-show="showPage">
        <div class="order-wrapper">
          <div class="fixed-bar">
            <mock-search-bar class="mock-search-bar" @clickSearch="_toSearchOrder"></mock-search-bar>
            <status-bar
              :status-arr="statusArr"
              @statusChange="_changeStatus"
              ref="statusBar"
            ></status-bar>
          </div>
          <order-list-container :order-list="orderList"></order-list-container>
        </div>
        <div class="search-order"></div>
      </div>
      <loading ref="loading"></loading>
    </div>
  </transition>

</template>

<script>
  import pageTitle from '../../components/item/page-title'
  import mockSearchBar from '../../components/search/mock-search-bar'
  import statusBar from '../../components/item/status-bar'
  import orderListContainer from '../../components/list/order-list'
  import loading from '../../components/tip/loading/loading'

  import getOrderList from '../../getData/order/getOrderList'

  import OrderItem from '../../baseClass/order/OrderItem'

  export default {
    name: "order-list",
    data() {
      return {
        statusArr: ['全部', '待付款', '已付款', '已取消'],
        orderList: [],
        allOrderList: [],
        hasPaiedOrderList: [],
        cancelOrderList: [],
        noPaiedOrderList: [],
        showPage: false
      }
    },
    mounted() {
      this._initComponents();
      this._getOrderList();
    },
    methods: {
      _initComponents() {
        this.loading = this.$refs.loading;
        this.statusBar = this.$refs.statusBar;
      },
      async _getOrderList() {
        this.loading.showLoading();
        let res = await getOrderList();
        if (res.data.code == 200) {
          let resData = res.data.data[0];
          let orderList = [];
          if (resData) {
            resData.getuserorderList2Fy.forEach(item => {
              orderList.push(new OrderItem(item))
            });
            this.orderList = orderList;
            this._separateOrderList(this.orderList);
          }
          this.showPage = true;
        }
        this.loading.hideLoading();
      },
      //将订单区分为待付款，已付款，已取消
      _separateOrderList(orderList) {
        this.allOrderList = orderList;
        this.cancelOrderList = [];
        this.noPaiedOrderList = [];
        this.hasPaiedOrderList = [];
        orderList.forEach(item => {
          let {orderStatus} = item;
          if (orderStatus == 10006) {
            this.cancelOrderList.push(item);
          } else if (orderStatus == 10001) {
            this.noPaiedOrderList.push(item);
          } else {
            this.hasPaiedOrderList.push(item)
          }
        })
      },
      _changeStatus(index) {
        this.statusBar.changeStatus(index);
        let orderList = [];
        switch (index) {
          case 0:
            orderList = this.allOrderList;
            break;
          case 1:
            orderList = this.noPaiedOrderList;
            break;
          case 2:
            orderList = this.hasPaiedOrderList;
            break;
          case 3:
            orderList = this.cancelOrderList;
            break;
          default:
            break;
        }
        this.orderList = orderList;
      },
      _toSearchOrder() {
        this.$router.push({
          name: 'search-order'
        })
      }
    },
    watch: {
      $route(to) {
        if (to.name == 'order-list') {
          this._getOrderList();
        }
      }
    },
    components: {
      pageTitle,
      mockSearchBar,
      statusBar,
      orderListContainer,
      loading
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .order-list-container {
    width: 100%;
    height: 100%;
    background: @middleGray;
  }

  .order-wrapper {
    height: 100%;
    overflow: hidden;
    position: relative;
    padding-top: 196px;
    box-sizing: border-box;
    .fixed-bar {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      .mock-search-bar {
        position: static;
      }
    }
    .order-list {
      height: 100%;
      overflow: auto;
    }
  }
</style>
