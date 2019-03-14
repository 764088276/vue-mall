<template>
    <div class="_order-list-container">
      <div class="order-item"
           v-for="(order,index) in orderList"
           :key="index"
           @click="_toOrderDetail(order)"
      >
        <div class="top-bar">
          <span>{{order.receiveName}}</span>
          <span>{{order.createTime}}</span>
        </div>
        <order-item :order-item="order"></order-item>
        <div class="order-num">
          <span>订单号：{{order.orderSn}}</span>
          <span>
            <span>共{{order.nums}}件商品</span>
            <span>{{_orderItemStatus(order)}}</span>
          </span>
        </div>
        <order-btns :order-item="order"></order-btns>
      </div>
      <no-result
        text="列表中空空如也"
        class="no-result"
        v-if="!orderList.length"
      ></no-result>
    </div>
</template>

<script>
  import orderItem from '../item/order-item'
  import orderBtns from '../item/order-btns'
  import noResult from '../tip/no-result/no-result'

  export default {
    name: "order-list",
    props:{
      orderList:{
        type:Array,
        default:()=>[]
      }
    },
    computed:{

    },
    methods:{
      _orderItemStatus(orderItem){
        let {orderStatus}=orderItem;
        if(orderStatus==10001){
          return '待付款'
        }
        if(orderStatus==10006){
          return '已取消'
        }
        return '已付款'
      },
      _toOrderDetail(order){
        let {orderId}=order;
        this.$router.push({
          name:'order-detail',
          params:{
            orderId
          }
        })
      }
    },
    components: {
      orderItem,
      orderBtns,
      noResult
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import "../../assets/less/common.less";
  ._order-list-container{
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .order-item{
    width: 100%;
    background: #fff;
    margin-top:10px;
    border-top:1px solid @lightGrayColor;
    border-bottom:1px solid @lightGrayColor;
    #commonStyle{
      padding:0 20px;
      box-sizing:border-box;
      line-height: 80px;
      height:80px;
    }

    .top-bar{
      #commonStyle();
      border-bottom:1px solid #ccc;
    }
    .order-num{
      border-top:1px solid #ccc;
      #commonStyle();
      #flexStyle(space-between);
    }
  }
  .no-result{
    margin-top:40px;
  }
</style>
