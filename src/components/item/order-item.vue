<template>
  <div class="_order-item" v-if="orderItem">
    <img :src="orderItem.coverImg" class="order-pic" alt="">
    <div class="order-goods-info">
      <section class="goods-name">
        <span>{{orderItem.name}}</span>
      </section>
      <section class="order-price">
        <span class="price">￥{{orderItem.price}}</span>
        <span class="num">&times;{{orderItem.nums}}</span>
      </section>
    </div>
  </div>
</template>

<script>
  export default {
    name: "order-item",
    props:{
      orderItem:{
        type:Object,
        default:()=>null
      }
    },
    components: {

    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  ._order-item {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;

    #flexStyle();

    .order-pic {
      width: 150px;
      height: 150px;
      margin-right: 14px;
    }
    .order-goods-info {
      flex: 1;
      #flexStyle(space-between);
      .goods-name {
        margin-right: 40px;
        #overLinesEllipsis(3);
      }
      .order-price {
        color: @defaultColor;
        > span {
          display: block;
          text-align: right;
        }
      }
    }
  }
</style>
