<template>
  <transition name="slide">
    <div class="order-detail page-container with-pagetitle">
      <page-title title="订单详情"></page-title>
      <scroll v-if="orderDetail.length">
        <div class="order-detail-container">
          <div class="address">
            <span class="iconfont icon-addr"></span>
            <div class="addr-content">
              <div class="contact">
                <span>{{orderDetail[0].receiveName}}</span>
                <span>{{orderDetail[0].receivePhone}}</span>
              </div>
              <div class="detail">
                <span>{{orderDetail[0].address}}</span>
              </div>
            </div>
          </div>
          <div class="order-msg">
            <order-item v-for="(order,index) in orderDetail" :key="index" :order-item="order"></order-item>
            <div class="price-item">
              <span>商品总价</span>
              <span>￥{{totalPrice}}</span>
            </div>
            <div class="price-item">
              <span>运费</span>
              <span>￥{{orderDetail[0].postageFare}}</span>
            </div>
            <div class="price-item red">
              <span>实付款</span>
              <span>￥{{orderDetail[0].price}}</span>
            </div>
          </div>
          <div class="order-sn">
            <section class="order-sn-item">
              <span>订单编号:</span>
              <span>{{orderDetail[0].orderSn}}</span>
            </section>
            <section class="order-sn-item">
              <span>创建时间:</span>
              <span>{{orderDetail[0].createTime}}</span>
            </section>
            <section class="order-sn-item" v-if="orderDetail[0].paidTime">
              <span>支付时间:</span>
              <span>{{orderDetail[0].paidTime}}</span>
            </section>
          </div>
        </div>
      </scroll>
      <order-btns class="order-btns" v-if="orderDetail.length" :order-item="orderDetail[0]"></order-btns>
      <loading ref="loading"></loading>
      <toast ref="toast"></toast>
    </div>
  </transition>

</template>

<script>
  import orderItem from '../../components/item/order-item'
  import orderBtns from '../../components/item/order-btns'
  import scroll from '../../components/tip/scroll/scroll'
  import loading from '../../components/tip/loading/loading'
  import pageTitle from '../../components/item/page-title'
  import toast from '../../components/tip/toast'

  import getOrderDetail from '../../getData/order/getOrderDetail'

  import OrderItem from '../../baseClass/order/OrderItem'

  export default {
    name: "order-detail",
    data() {
      return {
        orderId: '',
        orderDetail: [],
        totalPrice:0
      }
    },
    mounted() {
      this._initComponents();
      this._initPage();
    },
    methods: {
      _initComponents() {
        this.loading = this.$refs.loading;
        this.toast = this.$refs.toast;
      },
      _initPage(){
        this._getQuery();
        this._getOrderDetail()
      },
      _getQuery() {
        this.orderId = this.$route.params.orderId
      },
      _getOrderDetail() {
        this.loading.showLoading();
        let {orderId} = this;
        getOrderDetail(orderId).then(res => {
          this.loading.hideLoading();
          if (res.data.code == 200) {
            let resData = res.data.data[0];
            let orderDetail=[];
            if (resData) {
              resData.getOrderList.forEach(item => {
                orderDetail.push(new OrderItem(item))
              });
              this.orderDetail=orderDetail;
              this._calcTotalPrice(orderDetail);
            }
          }
        })
      },
      _calcTotalPrice(orderDetail){
        let totalPrice=0;
        this.orderDetail.forEach(item=>{
          let unitPrice=parseFloat(item.unitPrice);
          let nums=parseFloat(item.nums);
          totalPrice+=(unitPrice*nums)
        });
        this.totalPrice=parseFloat(totalPrice.toFixed(2))
      }
    },
    watch: {
      $route(to) {
        let {orderId}=this;
        if(to.params.orderId==orderId){
          return
        }
        this.orderDetail=[];
        if (to.name == 'order-detail') {
          this._initPage();
        }
      }
    },
    components: {
      orderBtns,
      orderItem,
      scroll,
      loading,
      pageTitle,
      toast
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  #pagePadding {
    padding: 0 20px;
    box-sizing: border-box;
    width: 100%;
  }

  .order-detail {
    background: @middleGray;
    .order-detail-container {
      .address {
        background: #fff;
        margin-top:10px;
        #flexStyle();
        #pagePadding();
        color: #666;
        padding: 24px 20px;
        .iconfont {
          font-size: 36px;
          color: @defaultColor;
          margin-right: 20px;
        }
        .addr-content {
          flex: 1;
          .contact {
            #flexStyle(space-between)
          }
          .detail {
            margin-top: 10px;
          }
        }
      }
      .order-msg {
        margin-top: 10px;
        background: #fff;
        .price-item {
          #pagePadding();
          #flexStyle(space-between, center);
          color: @grayColor;
          height: 80px;
          border-top: 1px solid #ccc;
          &.red {
            color: red;
          }
        }
      }
      .order-sn {
        #pagePadding();
        padding: 24px 20px;
        color: #666;
        background: #fff;
        margin-top: 10px;
        .order-sn-item {
          line-height: 40px;
        }
      }
    }
    .order-btns {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
</style>
