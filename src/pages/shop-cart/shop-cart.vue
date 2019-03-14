<template>
  <div class="shop-cart with-tabbar">
    <div class="shop-cart-container" v-if="shopCartList.length">
      <div class="delete-bar">
        <div class="delete-btn" @click="_deleteCartItem">
          <span>删除</span>
        </div>
      </div>
      <scroll>
        <div class="shop-cart-list">
          <div class="cart-item" v-for="(item,index) in shopCartList" :key="index">
            <div class="cart-item-container">
              <div class="checkbox-part">
                <div class="checkbox" :class="{active:item.isChoosed}" @click="_chooseCartItem(index)">
                  <span class="iconfont icon-gou"></span>
                </div>
              </div>
              <div class="good-info">
                <img :src="item.coverImg" alt="" class="good-pic">
                <div class="good-msg">
                  <div class="good-name">
                    <span>{{item.name}}</span>
                  </div>
                  <div class="good-color-size">
                    {{item.goodColor}} {{item.goodSize}}
                  </div>
                  <div class="good-price">
                    <div class="price">
                      <span>￥{{item.sellPrice}}</span>
                    </div>
                    <div class="handler">
                      <span class="decrease iconfont icon-jian" @click="_decreaseGoodNum(index)"></span>
                      <span class="num">{{item.goodNum}}</span>
                      <span class="increase iconfont icon-jia" @click="_increaseGoodNum(index)"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll>

      <div class="checkout-bar">
        <div class="price">
          <div class="checkbox-part" @click="_chooseAllCartItem">
            <div class="checkbox" :class="{active:isAllChoosed}">
              <span class="iconfont icon-gou"></span>
            </div>
            <span>已选（{{allShopNum}}）</span>
          </div>
          <div class="all-price">
            <span>￥{{allPrice}}</span>
          </div>
        </div>
        <div class="checkout-btn" @click="_checkout">
          <span>结算</span>
        </div>
      </div>
    </div>
    <div class="no-result-wrapper" v-if="!shopCartList.length">
      <no-result text="购物车里面空空的"></no-result>
      <div class="shop-btn" @click="toIndex">
        <span>去首页逛逛吧</span>
      </div>
      <recom-list class="_recom-list"></recom-list>
    </div>
    <loading ref="loading"></loading>
    <confirm ref="confirm"></confirm>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  import noResult from '../../components/tip/no-result/no-result'
  import recomList from '../../components/list/recom-list'
  import loading from '../../components/tip/loading/loading'
  import toast from '../../components/tip/toast'
  import confirm from '../../components/tip/confirm'
  import scroll from '../../components/tip/scroll/scroll'

  import clearShopCart from '../../getData/shopCart/clearShopCart'

  import PayItem from '../../baseClass/order/PayItem'

  import {mapGetters, mapActions} from 'vuex'

  import {cid, userid} from '../../utils/constData'

  export default {
    name: "shop-cart",
    components: {
      recomList,
      noResult,
      confirm,
      toast,
      loading,
      scroll
    },
    data() {
      return {}
    },

    computed: {
      //所有商品的数量
      allShopNum() {
        let {shopCartList} = this;
        let allNum = 0;
        shopCartList.forEach(item => {
          if (item.isChoosed) {
            allNum += parseInt(item.goodNum)
          }
        });
        return allNum
      },
      //是否全选
      isAllChoosed() {
        let {shopCartList} = this;
        let isAllChoosed = shopCartList.every(item => {
          return item.isChoosed
        });
        return isAllChoosed
      },
      //全部选中的商品价格
      allPrice() {
        let {shopCartList} = this;
        let totalPrice = 0;
        shopCartList.forEach(item => {
          if (item.isChoosed) {
            let sellPrice = parseFloat(item.sellPrice);
            let goodNum = parseInt(item.goodNum);
            totalPrice = totalPrice + sellPrice * goodNum
          }
        });
        return totalPrice.toFixed(2)
      },
      ...mapGetters([
        'shopCartList'
      ])
    },
    mounted() {
      console.log(this.$store);
      this._getRefEle();
    },
    methods: {
      ...mapActions({
        '_setShopCartList': 'setShopList'
      }),
      toIndex() {
        this.$router.push({
          name: 'index'
        })
      },
      _getRefEle() {
        this.loading = this.$refs.loading;
        this.confirm = this.$refs.confirm;
        this.toast = this.$refs.toast;
      },
      //单选中和反选
      _chooseCartItem(index) {
        let shopCartList = this._deepCopyShopCartList();
        let curChoosed = shopCartList[index].isChoosed;
        shopCartList[index].isChoosed = !curChoosed;
        this._setShopCartList(shopCartList);
      },
      //对shopCartList进行深拷贝
      _deepCopyShopCartList() {
        return JSON.parse(JSON.stringify(this.shopCartList))
      },
      //全选
      _chooseAllCartItem() {
        let {isAllChoosed} = this;
        let shopCartList = this._deepCopyShopCartList();
        shopCartList.forEach(item => {
          item.isChoosed = !isAllChoosed;
        });
        this._setShopCartList(shopCartList);
      },
      //商品的数量加减
      _increaseGoodNum(index) {
        let shopCartList = this._deepCopyShopCartList();
        let curItem = shopCartList[index];
        let curGoodNum = curItem.goodNum;
        let {storage} = curItem;
        let numLimit = curItem.numLimit == '' ? 9999 : curItem.numLimit;
        let realLimit = Math.min(numLimit, storage);
        if (curGoodNum >= realLimit) {
          this.toast.showToast({
            text: '购买数量已达上限了~'
          });
          return false
        }
        curItem.goodNum = curGoodNum + 1;
        this._setShopCartList(shopCartList);
      },
      _decreaseGoodNum(index) {
        let shopCartList = this._deepCopyShopCartList();
        let curItem = shopCartList[index];
        let curGoodNum = curItem.goodNum;
        if (curGoodNum <= 1) {
          return false
        }
        curItem.goodNum = curGoodNum - 1;
        this._setShopCartList(shopCartList);
      },
      //删除购物车商品
      _deleteCartItem() {
        let {shopCartList} = this;
        let goodsId = [];
        let goodsColorSize = [];
        shopCartList.forEach(item => {
          if (item.isChoosed) {
            goodsId.push(item.id);
            goodsColorSize.push(item.goodColorSizeId || 0);
          }
        });
        if (!goodsId.length) {
          this.toast.showToast({
            text: '请至少选择一个商品删除'
          });
          return false
        }
        let clearData = {
          goodsId: goodsId.join(','),
          goodsColorSizeId: goodsColorSize.join(',')
        };
        this.confirm.showConfirm({
          text: '确定要删除选中的商品吗',
          success: () => {
            this.loading.showLoading();
            clearShopCart(clearData).then(res => {
              this.loading.hideLoading();
              let resMsg = res.data.message;
              this.toast.showToast({
                text: resMsg
              });
              if (res.data.code == 200) {
                this._offCartItem();
              }
            })
          }
        });
      },
      //去除掉删除的商品
      _offCartItem() {
        let {shopCartList} = this;
        let _shopCartList = [];
        shopCartList.forEach(item => {
          if (!item.isChoosed) {
            _shopCartList.push(item)
          }
        });
        this._setShopCartList(_shopCartList);
      },
      //判断用户是否至少选中一件商品
      _checkIsChooseGood() {
        let {shopCartList} = this;
        let isChoosed = shopCartList.some(item => {
          if (item.isChoosed && item.goodNum > 0) {
            return true
          }
        });
        return isChoosed
      },
      //结算
      _checkout() {
        if (!this._checkIsChooseGood()) {
          this.toast.showToast({
            text: '请至少选择一件商品~'
          });
          return
        }
        let orderGoods = [];
        let {shopCartList} = this;
        shopCartList.forEach(item => {
          orderGoods.push(new PayItem(item))
        });
        let orderMsg = {
          goods: orderGoods,
          cid,
          user_id: userid
        };
        this.$router.push({
          name: 'create-order',
          query: {
            orderMsg: JSON.stringify(orderMsg)
          }
        })
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .shop-cart {
    background: #fff;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;

    .shop-cart-container {
      width: 100%;
      height: 100%;
      position: relative;
      padding: 90px 0 96px;
      box-sizing: border-box;

      .checkbox-part {
        #flexStyle('', center);
        color: @defaultColor;

        .checkbox {
          border: 1px solid @defaultColor;
          margin-right: 14px;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          .iconfont {
            font-size: 30px;
            display: none;
          }
          &.active {
            .iconfont {
              display: block;
            }
          }
        }
      }

      .shop-cart-list {
        background: #fff;

        .cart-item {
          padding: 26px 28px;
          box-sizing: border-box;
          width: 100%;
          border-bottom: 1px solid @lightGrayColor;
          .cart-item-container {
            width: 100%;
            #flexStyle(space-between, center);
            flex-wrap: wrap;
            .good-info {
              flex: 1;
              /*width:450px;*/
              #flexStyle();
              font-size: @middleFont;

              .good-pic {
                width: 160px;
                height: 140px;
              }
              .good-msg {
                flex: 1;
                margin-left: 18px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 140px;
                .good-name {
                  #overLinesEllipsis(1);
                  width: 100%;
                }
                .good-color-size {
                  color: @grayColor;
                }
                .good-price {
                  #flexStyle(space-between, center);

                  .handler {
                    width: 240px;
                    border: 1px solid @grayColor;
                    #flexStyle();
                    line-height: 44px;
                    font-weight: 800;
                    > span {
                      width: 33%;
                      display: block;
                      text-align: center;
                    }
                    .iconfont {
                      font-size: 30px;
                      color: @grayColor;
                    }
                    .num {
                      border-left: 1px solid @grayColor;
                      border-right: 1px solid @grayColor;
                    }
                  }
                }
              }
            }
          }

        }
      }
      .delete-bar {
        #positionStyle(absolute);
        width: 100%;
        height: 90px;
        #flexStyle('', center);
        padding: 0 28px;
        box-sizing: border-box;
        background: @middleGray;

        .delete-btn {
          width: 120px;
          line-height: 40px;
          text-align: center;
          color: @defaultColor;
          border: 1px solid @defaultColor;
          border-radius: 30px;
          font-size: @middleFont;
        }
      }
      .checkout-bar {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        height: 96px;
        #flexStyle();
        background: #fff;
        z-index: 10;
        font-size: @largeFont;
        border-top: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;

        .price {
          flex: 1;
          #flexStyle(space-between, center);
          padding: 0 20px;
          box-sizing: border-box;
          height: 100%;
        }
        .checkout-btn {
          width: 232px;
          height: 100%;
          color: #fff;
          font-size: 34px;
          background: @defaultColor;
          #flexStyle(center, center)
        }
      }
    }

    ._recom-list {
      margin-top: 40px;
    }
  }

  .no-result-wrapper {
    padding: 50px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .shop-btn {
      margin-top: 20px;
      line-height: 56px;
      border: 1px solid @defaultColor;
      color: @defaultColor;
      padding: 0 28px;
      font-size: @largeFont;
      border-radius: 30px;
      display: inline-block;
    }
  }
</style>
