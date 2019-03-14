<template>
  <div class="page-container create-success with-pagetitle">
    <page-title title="创建订单成功"></page-title>
    <section class="order-info">
      <img src="../../assets/images/pay-success-icon.png" alt="">
      <div class="order-msg">
        <div class="top-text"><strong>订单创建成功</strong></div>
        <div class="total-price">￥{{totalPrice}}</div>
        <div class="bottom-text">请前往小程序支付</div>
      </div>
      <div class="btns">
        <div class="link-btn" @click="_toRouter('order-detail')">
          <span>查看订单</span>
        </div>
        <div class="link-btn" @click="_toRouter('index')">
          <span>返回首页</span>
        </div>
      </div>
    </section>
    <section class="recom-container">
      <recom-list></recom-list>
    </section>
  </div>
</template>

<script>
  import pageTitle from '../../components/item/page-title'
  import recomList from '../../components/list/recom-list'
  export default {
    name: "create-order-success",
    components: {
      pageTitle,
      recomList
    },
    data(){
      return {
        orderId:'',
        totalPrice:0
      }
    },
    created(){
      this._initPage();
    },
    methods:{
      _initPage(){
        let {orderId,totalPrice}=this.$route.query;
        this.orderId=orderId;
        this.totalPrice=totalPrice;
        console.log(this.$router);
      },
      _toRouter(routerName){
        let params={};
        let {orderId}=this;
        if(routerName.indexOf('order')>-1){
          params.orderId=orderId;
        }
        this.$router.push({
          name:routerName,
          params
        })
      }
    },
    watch:{
      $route(to){
        if(to.name=='create-order-success'){
          this._initPage();
        }
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';
  .order-info{
    width:100%;
    padding:20px;
    box-sizing:border-box;
    #flexStyle();
    flex-wrap:wrap;

    >img{
      height:200px;
    }
    .order-msg{
      font-size:@middleFont;
      flex:1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height:200px;
      margin-left:20px;
      .top-text{
        font-size:@largeFont;
      }
      .total-price{
        margin:10px 0;
      }
      .bottom-text{
        color:@grayColor;
      }
    }
    .btns{
      width:100%;
      #flexStyle(space-around,center);
      margin-top:20px;
      .link-btn{
        width:234px;
        height:72px;
        font-size:@middleFont;
        text-align: center;
        border:1px solid #333;
        margin:0 10px;
        line-height: 72px;
        border-radius:12px;
      }
    }
  }
</style>
