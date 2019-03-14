<template>
  <div class="detail-recom" v-if="goodList.length">
    <div class="title">
      <span>大家都在看</span>
    </div>
    <scroll
      :is-y-scroll="false"
      scroll-height="auto"
      :need-click="true"
      event-passthrough="vertical"
    >
      <div class="detail-recom-content" :style="{width:contentWidth+'px'}">
        <div class="recom-item" v-for="(good,index) in goodList" :key="index">
          <img class="good-pic" :src="good.coverImg" alt="">
          <div class="name">
            <span>{{good.name}}</span>
          </div>
          <div class="price">
            <strong>￥{{good.sellPrice}}</strong>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import scroll from '../tip/scroll/scroll'

  import getRecomList from '../../getData/good/getRecomList'

  import GoodItem from '../../baseClass/good/goodItem'
  export default {
    name: "detail-recom",
    components: {
      scroll
    },
    data(){
      return {
        goodList:[],
        itemWidth:258,
        contentWidth:0
      }
    },
    created(){
      this._getRecomList();
    },
    methods:{
      _getRecomList(){
        getRecomList().then(res=>{
          if(res.data.code==200){
            let resData=res.data.data[0];
            if(resData){
              resData.goodslist.forEach(item=>{
                this.goodList.push(new GoodItem(item));
              });
              this._setWidth();
            }
          }
        })
      },
      _setWidth(){
        let {goodList,itemWidth}=this;
        let width=0;
        for(let i =0,l=goodList.length;i<l;i++){
          width+=itemWidth;
        }
        this.contentWidth=width;
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';
  .detail-recom{
    width:100%;
    background: #fff;
    padding-bottom:14px;

    .title{
      width:100%;
      line-height: 70px;
      text-align: center;
      font-size:@largeFont;
    }
    .detail-recom-content{
      display: flex;
      overflow:auto;

      .recom-item{
        width:226px;
        padding:0 16px;
        font-size:@middleFont;
        .good-pic{
          width:100%;
          height:226px;
        }
        .name{
          #overLinesEllipsis(2);
          margin:4px 0;
        }
        .price{

        }
      }
    }
  }
</style>
