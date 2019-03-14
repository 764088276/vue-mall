<template>
  <div class="good-list" ref="goodList" :class="goodListClass">
    <div class="good-item" v-for="(good,index) in goodList" :key="index" @click="_toDetail(good.id)">
      <img :src="good.coverImg" alt="" class="good-pic">
      <div class="good-name">
        <span>{{good.name}}</span>
      </div>
      <div class="good-price">
        <div class="price">
          <span>￥{{good.sellPrice}}</span>
        </div>
        <!--<span class="cart-icon iconfont icon-cart1" v-if="good.isAllowShopCart" @click.stop="_showParamLayer(good.id)"></span>-->
      </div>
    </div>
    <loading ref="loading"></loading>
    <toast ref="toast"></toast>
    <!--<param-layer v-if="isShowParamLayer" :good-item="paramGoodItem" :good-type="paramGoodType"></param-layer>-->
  </div>
</template>

<script>
  import paramLayer from '../layer/param-layer'
  import loading from '../tip/loading/loading'
  import toast from '../tip/toast'

  import getGoodDetail from '../../getData/good/getGoodDetail'
  import getGoodType from '../../getData/good/getGoodType'

  import GoodItem from '../../baseClass/good/goodItem'

  export default {
    name: "good-list",
    props: {
      goodList: {
        type: Array,
        default: () => []
      },
      threeColumn: {
        type: Boolean,
        default: false
      },
      xScroll: {
        type: Boolean,
        default: false
      }
    },
    components: {
      paramLayer,
      toast,
      loading
    },
    data() {
      return {
        isXScroll: this.xScroll,
        isThreeColumn: this.threeColumn,
        isShowParamLayer: false,
        paramGoodItem: null,
        paramGoodType: []
      }
    },
    computed: {
      goodListClass() {
        return {
          three: this.isThreeColumn
        }
      }
    },
    created() {

    },
    mounted() {
      this._initComponents();
      this._initGoodList();
    },
    methods: {
      _initComponents() {
        this.loading = this.$refs.loading;
        this.toast = this.$refs.toast;
      },
      _initGoodList() {
        if (this.isXScroll) {
          this.setWidth();
        }
      },
      _toDetail(id) {
        this.$router.push({
          name: 'good-detail',
          query: {
            id
          }
        })
      },
      setWidth() {
        let {goodList, isThreeColumn, isXScroll} = this;
        let goodListNum = goodList.length;
        if (!isThreeColumn && goodListNum <= 2) {
          return false
        }
        if (isThreeColumn && goodListNum <= 3) {
          return false
        }
        let listWidth = 0;
        let goodItemWidth = isThreeColumn ? 750 / 3 : 750 / 2;
        for (let i = 0; i < goodListNum; i++) {
          listWidth += goodItemWidth
        }
        this.$refs.goodList.style.width = listWidth + 'px';
      },
      _getGoodDetail(goodId) {
        return new Promise(resolve => {
          getGoodDetail(goodId).then(res => {
            if (res.data.code == 200) {
              let resData = res.data.data[0];
              this.paramGoodItem = new GoodItem(resData.getGoodsDetail[0]);
            }
            resolve();
          })
        })
      },
      _getGoodType(goodId) {
        return new Promise(resolve => {
          getGoodType(goodId).then(res => {
            if (res.data.code == 200) {
              let resData = res.data.data[0];
              this.paramGoodType = resData.getProductMapping;
            }
            resolve();
          })
        })
      },
      _showParamLayer(goodId) {
        this.loading.showLoading();
        Promise.all([this._getGoodDetail(goodId),this._getGoodType(goodId)]).then(()=>{
          this.loading.hideLoading();
          this.isShowParamLayer=true;
        })
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .good-list {
    width: 100%;
    #flexStyle(space-between);
    flex-wrap: wrap;
    .good-item {
      width: 375px;
      padding: 20px;
      box-sizing: border-box;
      font-size: @middleFont;
      background: #fff;
      .good-pic {
        width: 100%;
        height: 335px;
      }
      .good-name {
        margin: 4px 0;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 30px;
        height: 60px;
      }
      .good-price {
        #flexStyle(space-between, center);

        .cart-icon {
          font-size: 38px;

        }
      }
    }
    &.three {
      .good-item {
        width: 250px;
        padding: 10px;
        & > img {
          height: 230px;
        }
      }
    }
  }
</style>
