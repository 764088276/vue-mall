<template>
  <div class="order-btns">
    <div class="btn-container">
      <div class="order-btn" v-if="orderStatus==10002">
        <span>申请退货</span>
      </div>
      <div class="order-btn" v-if="orderStatus==10004" @click.stop="_toComment(curOrderItem.orderId)">
        <span>发表评价</span>
      </div>
      <div class="order-btn" v-if="orderStatus==10001" @click.stop="_payNow">
        <span>立即付款</span>
      </div>
      <div class="order-btn" v-if="orderStatus==10003" @click.stop="_confirmOrder">
        <span>确认收货</span>
      </div>
      <div class="order-btn" v-if="orderStatus==10001" @click.stop="_cancelOrder">
        <span>取消订单</span>
      </div>
    </div>
    <toast ref="toast"></toast>
    <confirm ref="confirm"></confirm>
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import toast from '../tip/toast'
  import confirm from '../tip/confirm'
  import loading from '../tip/loading/loading'

  import {cancelOrder,confirmOrder} from '../../getData/order/handleOrder'

  export default {
    name: "order-btns",
    props:{
      orderItem:{
        type:Object,
        default:()=>null
      }
    },
    data(){
      return {
        orderStatus:'',
        curOrderItem:this.orderItem
      }
    },
    created(){
      this.orderStatus=this.orderItem.orderStatus;
    },
    mounted(){
      this.toast=this.$refs.toast;
      this.confirm=this.$refs.confirm;
      this.loading=this.$refs.loading;
    },
    methods:{
      //立即支付
      _payNow(){
        this.toast.showToast({
          text:'请前往poney小程序上进行支付~'
        })
      },
      _toComment(orderId){
        this.$router.push({
          name:'comment-order',
          query:{
            orderId
          }
        })
      },
      //取消订单
      _cancelOrder(){
        this.confirm.showConfirm({
          text:'确定取消订单吗',
          success:()=>{
            let {orderId}=this.orderItem;
            this.loading.showLoading();
            cancelOrder(orderId).then(res=>{
              this.loading.hideLoading();
              let message='删除失败';
              if(res.data.code==200){
                message=res.data.message;
                setTimeout(()=>{
                  this.$router.back();
                },1500)
              }
              this.toast.showToast({
                text:message
              })
            })
          }
        })
      },
      //确认订单
      _confirmOrder(){
        this.confirm.showConfirm({
          text:'确定要确认收货吗',
          success:()=>{
            let {orderId}=this.orderItem;
            this.loading.showLoading();
            confirmOrder(orderId).then(res=>{
              let msg='确认收货失败';
              if(res.data.code==200){
                msg='确认收货成功！';
                this.curOrderItem.orderStatus=10004;
              }
              this.toast.showToast({
                text:msg
              })
            })
          }
        })
      }
    },
    components: {
      toast,confirm,loading
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .order-btns {
    padding: 0 20px;
    box-sizing: border-box;

    border-top: 1px solid #ccc;
    background: #fff;
    .btn-container{
      #flexStyle(flex-end);
    }
    .order-btn {
      line-height: 52px;
      color: @defaultColor;
      border: 1px solid @defaultColor;
      padding: 0 24px;
      margin:16px 0 16px 16px;
    }
  }
</style>
