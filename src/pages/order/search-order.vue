<template>
  <div class="search-order page-container with-pagetitle">
    <page-title title="搜索订单"></page-title>
    <search-bar
      :show-back="false"
      @search="_beginSearch"
      placeholder="手机号 / 订单号 / 收货人姓名"
      @inputEmpty="_resetOrderList"
      class="search-bar"
    ></search-bar>
    <div class="order-list-container with-mock-search">
      <order-list :order-list="orderList"></order-list>
    </div>
    <loading ref="loading"></loading>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  import scroll from '../../components/tip/scroll/scroll'
  import searchBar from '../../components/search/search-bar'
  import orderList from '../../components/list/order-list'
  import pageTitle from '../../components/item/page-title'
  import noResult from '../../components/tip/no-result/no-result'
  import loading from '../../components/tip/loading/loading'
  import toast from '../../components/tip/toast'

  import getOrderList from '../../getData/order/getOrderList'

  import OrderItem from '../../baseClass/order/OrderItem'

  const co = require('co');


  export default {
    name: "search-order",
    data() {
      return {
        orderList: [],
        keyword: ''
      }
    },
    components: {
      scroll,
      searchBar,
      orderList,
      pageTitle,
      noResult,
      loading,
      toast
    },
    mounted() {
      this._initComponents();
    },
    methods: {
      _initComponents() {
        this.loading = this.$refs.loading;
        this.toast=this.$refs.toast;
      },
      _beginSearch(keyword) {
        if(keyword==this.keyword){
          return
        }
        if(!keyword.trim()){
          return
        }
        this.keyword=keyword;
        this.loading.showLoading();
        co(this._getOrderList()).then(()=>{
          this.loading.hideLoading();
        })
      },
      *_getOrderList() {
        let {keyword}=this;
        let res=yield getOrderList({keyword});
        let resData=res.data.data[0];
        let orderList=[];
        if(resData){
          resData.getuserorderList2Fy.forEach(item=>{
            orderList.push(new OrderItem(item))
          })
        }else{
          this.toast.showToast({
            text:'没有搜索结果~'
          })
        }
        this.orderList=orderList;
      },
      //重置搜索条件
      _resetOrderList(){
        this.keyword='';
        this.orderList=[];
      }
    },

  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import "../../assets/less/common.less";
  .search-bar{
    #positionStyle(fixed,0,80px);
    width: 100%;
    z-index:10;
    background: #fff;
  }
  .order-list-container{
    width:100%;
    height: 100%;
    box-sizing: border-box;
    background: @middleGray;
  }
</style>
