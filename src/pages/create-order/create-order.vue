<template>
  <transition name="slide">
    <div class="page-container create-order with-pagetitle">
      <page-title title="确认订单"></page-title>
      <div class="address-container" @click="_chooseAddr">
        <img
          src="../../assets/images/addr-border.png"
          alt=""
          class="addr-border"
        >
        <div class="no-addr addr-item" v-if="!defaultAddr">
          <div class="no-addr-wrapper">
            <div class="new">
              <span class="iconfont icon-xinjian"></span>
              <span>新建收货地址</span>
            </div>
            <span class="text">需要填写收货地址才能下单哦</span>
          </div>
        </div>
        <div class="with-addr addr-item" v-if="defaultAddr">
          <div class="with-addr-wrapper">
            <section class="name">
              <section class="receiver-name">
                <span>{{defaultAddr.receiverName}}</span>
              </section>
              <section class="default-mark">
                <span>默认</span>
              </section>
            </section>
            <section class="info">
              <section class="phone">
                <span>{{defaultAddr.phone}}</span>
              </section>
              <section class="detail">
                <span>{{defaultAddr.allAddr}}</span>
              </section>
            </section>
            <span class="iconfont icon-back"></span>
          </div>
        </div>
      </div>

      <section class="order-container page-content">

        <scroll ref="scroll" class="scroll-container">
          <section class="order-msg">
            <ul class="order-info">
              <li class="info-item">
                <span>商品合计</span>
                <span>￥{{goodsTotalPrice}}</span>
              </li>
              <li class="info-item">
                <span>运费</span>
                <span>￥{{postageFare}}</span>
              </li>
              <li class="info-item">
                <span>备注</span>
                <input
                  type="text"
                  class="remark"
                  placeholder="可以在这里填写备注"
                  v-model="remark"
                >
              </li>
            </ul>
            <div class="order-content">
              <div class="order-item" v-for="(good,index) in orderGoods" :key="index">
                <img :src="good.coverImg" class="good-pic">
                <div class="good-msg">
                  <div class="good-name">
                    <span>{{good.name}}</span>
                  </div>
                  <div class="good-type">
                    <span>{{good.product_color}} {{good.product_size}}</span>
                  </div>
                  <div class="good-price">
                    <span class="price">￥{{good.sell_price}}</span>
                    <span>&times;{{good.goods_amount}}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </scroll>
      </section>
      <div class="bottom-bar">
        <div class="left-price">
          <span>应付￥</span>
          <span class="price">{{payAllPrice}}</span>
        </div>
        <div class="pay-btn" @click="_createOrder">
          <span>创建订单</span>
        </div>
      </div>
      <loading ref="loading"></loading>
      <toast ref="toast"></toast>
      <confirm ref="confirm"></confirm>
    </div>
  </transition>
</template>

<script>
  import pageTitle from '../../components/item/page-title'
  import scroll from '../../components/tip/scroll/scroll'
  import loading from '../../components/tip/loading/loading'
  import toast from '../../components/tip/toast'
  import confirm from '../../components/tip/confirm'

  import getDefaultAddr from '../../getData/addr/getDefaultAddr'
  import getPostFare from '../../getData/order/getPostFare'
  import createOrder from '../../getData/order/createOrder'

  import AddressItem from '../../baseClass/addr/AddressItem'

  const cityData=require('../../utils/plugins/city.js').cityData;
  export default {
    name: "create-order",
    data(){
      return {
        defaultAddr:null,
        postageFare:0,
        orderGoods:[],
        orderMsg:null,
        remark:''
      }
    },
    computed:{
      goodsTotalPrice(){
        let {orderGoods}=this;
        let totalPrice=0;
        orderGoods.forEach(item=>{
          let singlePrice=parseFloat(item.sell_price)*parseFloat(item.goods_amount);
          totalPrice+=singlePrice
        });
        return parseFloat(totalPrice.toFixed(2))
      },
      payAllPrice(){
        let goodsTotalPrice=this.goodsTotalPrice;
        let {postageFare}=this;
        return parseFloat((goodsTotalPrice+postageFare).toFixed(2))
      }
    },
    created(){
      this._getDefaultAddr();
    },
    mounted(){
      this._initComponents();
      this._initOrderMsg();
    },
    methods:{
      _initOrderMsg(){
        let {orderMsg}=this.$route.query;
        if(orderMsg){
          let _orderMsg=JSON.parse(orderMsg);
          this.orderGoods=_orderMsg.goods;
          this.orderMsg=_orderMsg;
        }
      },
      _initComponents(){
        this.loading=this.$refs.loading;
        this.toast=this.$refs.toast;
        this.confirm=this.$refs.confirm;
      },
      //获取用户默认地址
      _getDefaultAddr(){
        getDefaultAddr().then(res=>{
          if(res.data.code==200){
            let resData=res.data.data[0];
            if(resData){
              this.defaultAddr=new AddressItem(resData.defind[0]);
              let province=this.defaultAddr.province;
              this._getPostageFare(province);
            }
          }
        })
      },
      _getPostageFare(province){
        let provinceCode='';
        let {orderGoods}=this;
        for(let i =0,l=cityData.length;i<l;i++){
          let city=cityData[i];
          if(city.name==province){
            provinceCode=city.id
          }
        }
        //如果检索不到，默认运费为0
        if(provinceCode===''){
          console.log('运费',0);
          return
        }
        let goodsList=[];
        orderGoods.forEach(item=>{
          goodsList.push({
            goods_id:item.goods_id,
            goods_num:item.goods_amount,
            unit_price:item.sell_price
          })
        });
        let postData={
          goodsList:JSON.stringify(goodsList),
          provinceCode:provinceCode.toString().substr(0,2)
        };
        getPostFare(postData).then(res=>{
          if(res.data.code==200){
            this.postageFare=res.data.data;
            console.log('运费',this.postageFare)
          }
        })
      },
      _createOrder(){
        let {defaultAddr,orderMsg,remark}=this;
        if(!this._checkAllCondition()){
          return
        }
        let _orderMsg=JSON.parse(JSON.stringify(orderMsg));
        _orderMsg.order_remark=remark;
        _orderMsg.paied_by_account_balance=0;
        _orderMsg.with_discount='N';
        _orderMsg.total_price=this.payAllPrice;
        _orderMsg.goods.forEach(item=>{
          item.price=item.sell_price*item.goods_amount;
          item.coupon_id=0;
        });
        let payData={
          'addressId':defaultAddr.addrId,
          'address':defaultAddr.detail,
          'receiverName':defaultAddr.receiverName,
          orderMsg:_orderMsg
        };
        this.loading.showLoading();
        createOrder(payData).then(res=>{
          this.loading.hideLoading();
          if(res.data.state==200){
            let orders=res.data.orders;
            let totalPrice=0;
            orders.forEach(item=>{
              totalPrice+=parseFloat(item[1]);
            });
            this.$router.replace({
              name:'create-order-success',
              query:{
                orderId:orders[0][0],
                totalPrice:parseFloat(totalPrice.toFixed(2))
              }
            })
          }else{
            let msg =res.data.message;
            this.toast.showToast({
              text:msg
            })
          }
        })
      },
      //下单之前的所有判断
      _checkAllCondition(){
        let {defaultAddr,orderMsg,orderGoods}=this;
        if(!defaultAddr){
          this.toast.showToast({
            text:'请选择收货地址~'
          });
          return false
        }
        if(this._isHasCrossGood()&&!defaultAddr.idNumber){
          this.toast.showToast({
            text:'购买的商品中存在跨境商品，需要填写身份证信息'
          });
          return false
        }
        return true
      },
      //判断商品是否存在跨境商品
      _isHasCrossGood(){
        let {orderGoods}=this;
        return orderGoods.some(item=>{
          return item.isCross
        })
      },
      //选择收货地址
      _chooseAddr(){
        this.$router.push({
          name:'addr-list',
          query:{
            from:'create-order'
          }
        })
      }
    },
    watch:{
      $route(to){
        if(to.name=='create-order'){
          this._initOrderMsg();
        }
      }
    },
    components: {
      pageTitle,
      scroll,
      confirm,
      toast,
      loading
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';
  .address-container {
    #positionStyle(absolute, 0, 80px);
    background: #fff;
    border-bottom:1px solid @lightGrayColor;
    z-index:100;
    .addr-border {
      width: 100%;
      display: block;
    }
    .addr-item {
      height: 160px;
    }
    .no-addr {
      #flexStyle(center, center);
      .no-addr-wrapper {
        .new {
          #flexStyle(center);
          margin-bottom: 4px;
          .iconfont {
            font-size: 32px;
            margin-right: 10px;
            color: @defaultColor;
          }
        }
        .text {
          color: @grayColor;
          font-size: @smallFont;
        }
      }
    }
    .with-addr {
      width: 100%;
      .with-addr-wrapper {
        height: 100%;
        #flexStyle(center, center);
        .name {
          #flexStyle(center, center);
          flex-wrap: wrap;
          margin: 0 30px;
          .receiver-name{
            width:100%;
            text-align: center;
          }
          .default-mark {
            font-size: 20px;
            border: 1px solid @defaultColor;
            line-height: 30px;
            width: 60px;
            height: 30px;
            text-align: center;
            color: @defaultColor;
            margin-top: 6px;
          }
        }
        .info {
          flex:1;
          #flexStyle('', center);
          flex-wrap: wrap;
          margin-right: 20px;
          .detail {
            width:100%;
            margin-top: 4px;
            font-size: 26px;
            color: @grayColor;
          }
        }
        .icon-back {
          font-size: @largeFont;
          display: block;
          transform: rotate(180deg);
          margin-right: 10px;
          color: @grayColor;
        }
      }
    }
  }
  .order-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    font-size: @middleFont;
    background: @middleGray;
    padding: 172px 0 90px;
    box-sizing: border-box;

    .scroll-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing:border-box;
      .order-msg {
        width: 100%;
        .order-info {
          width: 100%;
          padding: 0 16px;
          box-sizing: border-box;
          background: #fff;
          .info-item {
            #flexStyle(space-between, center);
            height: 82px;
            border-bottom: 1px solid @grayColor;
            &:last-child {
              border: 0 none;
            }
            .remark {
              text-align: right;
              color: #333;
            }
          }
        }
      }
      .order-content{
        margin-top:10px;
        .order-item{
          background: #fff;
          margin-bottom:10px;
          #flexStyle();
          padding:20px;
          box-sizing:border-box;
          .good-pic{
            width:150px;
            height:150px;
            margin-right:14px
          }
          .good-msg{
            flex:1;
            display:flex;
            flex-direction: column;
            justify-content: space-between;
            height: 150px;

            .good-name{
              #overLinesEllipsis(2);
            }
            .good-type{
              color:@grayColor;
            }
            .good-price{
              #flexStyle(space-between,center);
            }
          }
        }
      }
    }

  }
  .bottom-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 90px;
    background: #fff;
    #flexStyle(space-between);
    z-index:10;

    .left-price{
      line-height: 90px;
      flex:1;
      padding:0 20px;
      box-sizing:border-box;
      font-size:@middleFont;
      .price{
        color: @defaultColor;
        font-size:36px;
      }
    }
    .pay-btn{
      width:234px;
      height:100%;
      text-align: center;
      color:#fff;
      background: @defaultColor;
      line-height: 90px;
      font-size:@largeFont;
    }
  }
</style>
