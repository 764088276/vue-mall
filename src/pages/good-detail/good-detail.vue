<template>
  <transition name="slide">
    <div class="page-container with-pagetitle" v-if="isShow">
      <page-title :title="pageTitle" class="page-title"></page-title>
      <div class="good-detail page-content" v-if="goodDetail">
        <div class="good-detail-container">
          <banner
            :img-arr="bannerArr"
            v-if="bannerArr.length"
            banner-height="750px"
          ></banner>
          <section class="good-info">
            <div class="good-name">
              <span class="name">{{goodDetail.name}}</span>
              <span class="iconfont icon-fenxiang" @click="_toShareImg"></span>
            </div>
            <div class="good-price">
              <span class="sell-price">￥{{goodDetail.sellPrice}}</span>
              <span class="market-price">￥{{goodDetail.marketPrice}}</span>
            </div>
          </section>
          <detail-recom></detail-recom>
          <section class="good-detail-part">
            <section class="change-bar">
              <div class="change-item active">
                <span>商品详情</span>
              </div>
              <div class="change-item">
                <span>评价</span>
              </div>
            </section>
            <section class="change-detail">
              <div class="detail">
                <div class="param-container">
                  <div class="param-title">
                    <span>商品参数</span>
                  </div>
                  <div class="param-item" v-if="goodDetail.brand">
                    <span class="param-label">品牌</span>
                    <span class="param-content">{{goodDetail.brand}}</span>
                  </div>
                  <div class="param-item" v-if="goodDetail.weight">
                    <span class="param-label">质量</span>
                    <span class="param-content">{{goodDetail.weight}}</span>
                  </div>
                  <div class="param-item" v-if="goodDetail.country">
                    <span class="param-label">国家</span>
                    <span class="param-content">{{goodDetail.country}}</span>
                  </div>
                </div>
                <div class="detail-imgs" v-if="goodDetail.detailImgs.length">
                  <img :src="img" alt="" v-for="(img,index) in goodDetail.detailImgs" :key="index">
                </div>
              </div>
              <!--<div class="comment"></div>-->
            </section>
          </section>
        </div>
      </div>
      <div class="handler-bar">
        <div class="handler-item index" @click="_toIndex">
          <span class="iconfont icon-index-empty"></span>
        </div>
        <div class="handler-item cart" @click="_toCart">
          <span class="iconfont icon-cart1"></span>
          <span class="cart-num">{{shopCartNum}}</span>
        </div>
        <div class="buy-btn">
          <div class="handler-item buy-now" @click="_showParamLayer('buy-now')">
            <span>立即购买</span>
          </div>
          <div class="handler-item add-cart" @click="_showParamLayer('add-cart')">
            <span>加入购物车</span>
          </div>
        </div>
      </div>
      <param-layer
        :good-item="goodDetail"
        :good-type="goodType"
        v-show="showParamLayer"
        v-if="loadingEnd&&goodDetail"
        @closeLayer="_closeParamLayer"
        @sure="_buyGood"
      ></param-layer>
      <toast ref="toast"></toast>
      <loading ref="loading"></loading>
    </div>
  </transition>
</template>

<script>
  import pageTitle from '../../components/item/page-title';
  import banner from '../../components/banner/banner'
  import toast from '../../components/tip/toast'
  import detailRecom from '../../components/list/detail-recom'
  import loading from '../../components/tip/loading/loading'
  import paramLayer from '../../components/layer/param-layer'

  import getGoodDetail from '../../getData/good/getGoodDetail'
  import getGoodType from '../../getData/good/getGoodType'
  import addToCart from '../../getData/shopCart/addToCart'

  import GoodItem from '../../baseClass/good/goodItem'
  import PayItem from '../../baseClass/order/PayItem'

  import {mapGetters,mapActions} from 'vuex'
  import {cid,userid} from '../../utils/constData'
  import storage from '../../utils/tool/storage'

  export default {
    name: "good-detail",
    components: {
      pageTitle,
      banner,
      toast,
      detailRecom,
      loading,
      paramLayer
    },
    data() {
      return {
        isShow:true,
        goodId: '',
        goodDetail: null,
        bannerArr: [],
        pageTitle: '',
        goodType: [],
        showParamLayer: false,
        loadingEnd: false,
        paramLayerType: ''
      }
    },
    computed: {
      ...mapGetters([
        'shopCartList',
        'shopCartNum'
      ])
    },
    mounted() {
      this._getTip();
      this._initGoodDetail();
    },
    methods: {
      ...mapActions({
        _getShopCartList:"getShopCartList"
      }),
      _initGoodDetail() {
        this.goodId = this.$route.query.id;
        this.loading.showLoading();
        Promise.all([this._getGoodDetail(), this._getGoodType()]).then(() => {
          this.loading.hideLoading();
          this.loadingEnd = true
        })
      },
      _getTip() {
        this.toast = this.$refs.toast;
        this.loading = this.$refs.loading;
      },
      //获取商品详情
      _getGoodDetail() {
        let {goodId} = this;
        return new Promise(resolve => {
          getGoodDetail(goodId).then(res => {
            if (res.data.code == 200) {
              let resData = res.data.data[0];
              if (!resData) {
                this.toast.showToast({
                  text: '该商品已下架~'
                });
                setTimeout(() => {
                  this.$router.back();
                }, 1500);
                return false
              }
              this.goodDetail = new GoodItem(resData.getGoodsDetail[0]);
              this._initOtherData(this.goodDetail);
            }
            resolve();
          })
        });
      },
      //获取商品规格
      _getGoodType() {
        let {goodId} = this;
        return new Promise(resolve => {
          getGoodType(goodId).then(res => {
            if (res.data.code == 200) {
              this.goodType = res.data.data[0].getProductMapping;
            }
            resolve()
          })
        });
      },
      //根据获取到的数据初始化页面数据
      _initOtherData(goodDetail) {
        this._initBanner(goodDetail.bannerImgs);
        this.pageTitle = goodDetail.name;
      },
      //初始化banner
      _initBanner(imgArr) {
        let bannerArr = [];
        imgArr.forEach(item => {
          bannerArr.push({
            imgUrl: item
          })
        });
        this.bannerArr = bannerArr;
      },
      //显示和关闭paramLayer
      _closeParamLayer() {
        this.showParamLayer = false;
      },
      _showParamLayer(type) {
        this.paramLayerType = type;
        let {goodDetail}=this;
        if(!goodDetail.isAllowShopCart&&type=='add-cart'){
          this.toast.showToast({
            text:'该商品不能加入购物车~'
          });
          return false
        }
        this.showParamLayer = true;
      },
      //立即购买或者加入购物车
      _buyGood(chooseData) {
        let {paramLayerType} = this;
        let {goodType, goodDetail} = this;
        let numLimit = goodDetail.numLimit || Infinity;
        if (goodType.length && (!chooseData.color || !chooseData.size)) {
          this.toast.showToast({
            text: '请选择商品规格~'
          });
          return false
        }
        if (chooseData.num > Math.min(numLimit, chooseData.storage)) {
          this.toast.showToast({
            text: '购物数量超出上限了~'
          });
          return false
        }
        //立即购买
        if (paramLayerType == 'buy-now') {
          let {goodDetail}=this;
          let good=Object.assign({},goodDetail,{
            goodColor:chooseData.color,
            goodSize:chooseData.size,
            goodNum:chooseData.num
          });
          let orderMsg={
            goods:[new PayItem(good)],
            user_id:userid,
            cid
          };
          this.$router.push({
            name:'create-order',
            query:{
              orderMsg:JSON.stringify(orderMsg)
            }
          })
        }
        //加入购物车
        if (paramLayerType == 'add-cart') {
          let data={
            id:goodDetail.id,
            num:chooseData.num,
            color:chooseData.color,
            size:chooseData.size
          };
          addToCart(data).then(res=>{
            let resMsg=res.data.message;
            this.toast.showToast({
              text:resMsg
            });
            this.showParamLayer=false;
            if(res.data.code==200){
              this._getShopCartList();
            }
          });
          return false
        }
      },
      _toIndex() {
        this.$router.push({
          name: 'index'
        })
      },
      _toCart() {
        this.$router.push({
          name: 'shop-cart'
        })
      },
      _toShareImg(){
        let {goodDetail}=this;
        storage.setItem('goodDetail',goodDetail);
        this.$router.push({
          name:'share-img'
        })
      }
    },
    watch: {
        $route(to, from) {
          let {goodId}=this;
          //从当前页面跳出时，销毁组件
          if (to.path.indexOf('good-detail')>-1&&to.query.id!=goodId) {
            this.goodDetail=null;
            this._initGoodDetail();
          }
        }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .page-container{
    padding-bottom:92px;
  }
  .good-detail {
    background: #f4f4f4;
    /*padding-bottom: 92px;*/

  }

  .slide-up-enter-active, .slide-up-leave-active {
    transition: all 0.5s;
    top:0;
  }

  .slide-up-enter, .slide-up-leave-to {
    top: 100%;
  }

  .good-info {
    width: 100%;
    padding: 26px 20px;
    box-sizing: border-box;
    margin-bottom: 10px;
    background: #fff;

    .good-name {
      #flexStyle(space-between, center);
      font-size: 32px;

      .name {
        width: 80%;
      }
      .iconfont {
        font-size: 32px;
      }
    }
    .good-price {
      margin-top: 20px;
      .sell-price {
        font-size: 36px;
        color: @defaultColor;
      }
      .market-price {
        font-size: @smallFont;
        color: @grayColor;
        text-decoration: line-through;
        margin-left: 8px;
      }
    }
  }

  .good-detail-part {
    background: #fff;
    width: 100%;
    margin-top: 10px;

    .change-bar {
      width: 100%;
      #flexStyle(space-around);
      border-bottom: 1px solid @grayColor;
      font-size: 32px;
      height: 100px;

      .change-item {
        height: 100%;
        box-sizing: border-box;
        line-height: 100px;
        &.active {
          border-bottom: 4px solid @defaultColor;
          color: @defaultColor;
        }
      }
    }
    .change-detail {

      .detail .param-container {
        padding: 0 20px;
        box-sizing: border-box;
        font-size: @middleFont;

        .param-title {
          line-height: 76px;
        }
        .param-item {
          line-height: 90px;
          border-top: 1px dashed @grayColor;

          .param-label {
            color: @grayColor;
          }
          .param-content {
            margin-left: 72px;
          }
        }
      }
      .detail-imgs {
        width: 100%;
        margin-top: 10px;
        img {
          width: 100%;
          display: block;
        }
      }
    }
  }

  .handler-bar {
    position:absolute;
    left: 0;
    bottom: 0;
    background: #fff;
    z-index: 100;
    width: 100%;
    height: 92px;
    display: flex;

    .handler-item {
      #flexStyle(center, center);
      border: 1px solid @grayColor;
      box-sizing: border-box;
      height: 100%;
      position: relative;
      &.index, &.cart {
        width: 92px;
        .iconfont {
          font-size: 42px;
          color: @grayColor;
        }
      }
      .cart-num {
        width: 30px;
        line-height: 30px;
        border-radius: 50%;
        background: @defaultColor;
        position: absolute;
        right: 8px;
        top: 8px;
        color: #fff;
        text-align: center;
        font-size: 18px;
      }
    }
    .buy-btn {
      flex: 1;
      #flexStyle();
      height: 100%;
      .handler-item {
        width: 50%;
        font-size: 32px;
        color: #fff;
        letter-spacing: 1px;
        &.buy-now {
          background: #ff9400
        }
        &.add-cart {
          background: #ff5e15;
        }
      }
    }
  }
</style>
