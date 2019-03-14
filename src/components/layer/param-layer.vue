<template>
  <transition>
    <section class="outer-layer">
      <div class="layer-bg"
           @click="_closeLayer"></div>
      <div class="param-container with-bottom-btn">
        <div class="good-type-info">
          <div class="left-img">
            <img :src="coverImg" alt="">
          </div>
          <div class="info">
            <div class="price">
              <span>￥{{sellPrice}}</span>
            </div>
            <div class="storage">
              <span>库存 {{storage}} 件</span>
            </div>
            <div class="choose-good-type" v-if="goodType.length">
              <span v-show="!color">请选择颜色分类</span>
              <span v-show="color">已选择{{color}} {{size}}</span>
            </div>
          </div>
        </div>
        <div class="type-container" v-if="goodType.length">
          <div class="type-item type-color">
            <div class="type-alias">
              <span>{{aliasArr[0]}}</span>
            </div>
            <ul class="type-content">
              <li
                class="type"
                v-for="(type,index) in formateTypeArr"
                :key="index"
                :class="{active:index===curColorIndex,disabled:type.allStorage<=0}"
                @click="_changeColor(index)"
              >
                <span>{{type.color}}</span>
              </li>
            </ul>
          </div>
          <div class="type-item type-color" v-if="color">
            <div class="type-alias">
              <span>{{aliasArr[1]}}</span>
            </div>

            <ul class="type-content">
              <li
                class="type"
                v-for="(type,index) in formateTypeArr[curColorIndex].size"
                :key="index"
                :class="{active:index===curSizeIndex}"
                @click="_changeSize(index)"
              >
                <span>{{type.size}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="choose-num">
          <div class="text">
            <span>数量</span>
            <span v-if="goodItem.numLimit">(限购{{goodItem.numLimit}}件)</span>
          </div>
          <div class="num-ctrl">
            <span
              class="decrease iconfont icon-jian"
              @click="_changeNum(-1)"
            ></span>
            <span class="num">{{num}}</span>
            <span
              class="increase iconfont icon-jia"
              @click="_changeNum(1)"
            ></span>
          </div>
        </div>
        <div class="bottom-whole-btn" @click="_clickSure">
          <div class="btn">确定</div>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
  import TypeItem from '../../baseClass/good/typeItem'

  export default {
    name: "param-layer",
    props: {
      goodItem: {
        type: Object,
        default: () => null
      },
      goodType: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        sellPrice: this.goodItem.sellPrice,
        storage: this.goodItem.storage,
        coverImg: this.goodItem.coverImg,
        color: '',
        size: '',
        num: 1,
        //格式化处理过的typeArr
        formateTypeArr: [],
        //颜色尺寸的别名
        aliasArr: [],
        //当前选择的颜色索引
        curColorIndex: '',
        //当前选择的尺寸索引
        curSizeIndex: ''
      }
    },
    components: {},
    mounted() {
      this._initGoodType();
    },
    methods: {
      _closeLayer(){
        this.$emit('closeLayer');
      },
      //对商品规格进行数据处理
      _initGoodType() {
        let {goodType} = this;
        if (!goodType.length) {
          return false
        }
        //获取别名数组
        this.aliasArr = [goodType[0].goods_color_alias || '颜色', goodType[0].goods_size_alias || '尺寸'];
        let formateGoodType = {};
        goodType.forEach(item => {
          let color = item.goods_color;
          if (!formateGoodType[color]) {
            formateGoodType[color] = [];
          }
          formateGoodType[color].push(new TypeItem(item))
        });
        for (let color in formateGoodType) {
          let sizeArr = formateGoodType[color];
          let allStorage = 0;
          sizeArr.forEach(item => {
            allStorage += item.storage;
          });
          this.formateTypeArr.push({
            color: color,
            allStorage,
            size: sizeArr
          })
        }
      },
      //重置部分参数
      _resetParam() {
        let {goodItem} = this;
        this.sellPrice = goodItem.sellPrice;
        this.num = 1;
        this.curSizeIndex='';
        this.coverImg=goodItem.coverImg;
        this.size='';
      },
      //改变颜色
      _changeColor(colorIndex) {
        let {curColorIndex}=this;
        let curColorObj=this.formateTypeArr[colorIndex];
        let {allStorage}=curColorObj;
        if(curColorIndex===colorIndex){
          return false
        }
        if(allStorage<=0){
          return false
        }
        this.storage=allStorage;
        this.curColorIndex = colorIndex;
        this.color=curColorObj.color;
        this._resetParam();
      },
      //改变尺寸
      _changeSize(sizeIndex){
        let {formateTypeArr,curColorIndex,goodItem}=this;
        let curSizeObj=formateTypeArr[curColorIndex].size[sizeIndex];
        let {priceChange,size,storage,coverImg}=curSizeObj;
        if(storage<=0){
          return false
        }
        this.curSizeIndex=sizeIndex;
        this.size=size;
        this.storage=storage;
        this.coverImg=coverImg;
        this.num=1;
        this.sellPrice=parseFloat((parseFloat(priceChange)+parseFloat(goodItem.sellPrice)).toFixed(2));
      },
      //减少数量,type:-1减，1加
      _changeNum(type){
        let {num,goodItem,storage}=this;
        //如果不设置numLimit，则将numLimit设置为无穷大
        let numLimit=goodItem.numLimit||Infinity;
        num=num+type;
        let limit=Math.min(storage,numLimit);
        if(num>limit||num<1){
          return false
        }
        this.num=num;
      },
      //点击了确定
      _clickSure(){
        let {color,size,num,sellPrice,storage,coverImg}=this;
        this.$emit('sure',{
          color,size,num,sellPrice,storage,coverImg
        })
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .param-container {
    width: 100%;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 101;
    padding-left: 32px;
    padding-right: 32px;
    box-sizing: border-box;

    .good-type-info {
      display: flex;
      font-size: @middleFont;
      .left-img {
        width: 200px;
        height: 200px;
        border-radius: 14px;
        background: #fff;
        padding: 10px;
        box-sizing: border-box;
        margin-top: -36px;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 10px;
        margin-left: 10px;
        .price {
          line-height: 60px;
          color: @defaultColor;
        }
        .storage {
          color: @grayColor;
        }
      }
    }

    .choose-num {
      display: flex;
      justify-content: space-between;
      font-size: @middleFont;
      align-items: center;
      padding: 30px 0;
      .num-ctrl {
        > span {
          width: 80px;
          height: 60px;
          display: inline-block;
          font-size: 34px;
          line-height: 60px;
          text-align: center;
        }
        .iconfont {
          background: @lightGrayColor;
          color: @grayColor;
        }
      }
    }
    .type-container {
      width: 100%;
      .type-item {
        width: 100%;
        border-bottom: 1px solid #f5f5f5;
        font-size: 32px;
        padding: 10px 0;

        .type-content {
          #flexStyle();
          flex-wrap: wrap;
          margin-top: 10px;

          .type {
            margin: 10px 20px 10px 0;
            background: @lightGrayColor;
            line-height: 50px;
            border-radius: 30px;
            padding: 0 20px;
            font-size: @middleFont;

            &.disabled{
              background:@middleGray;
              color:@grayColor;
            }
            &.active {
              background: @defaultColor;
              color: #fff;
            }
          }
        }
      }
    }
    .bottom-whole-btn {
      position: absolute;
      bottom: 0;
      left: 0;
    }

  }
</style>
