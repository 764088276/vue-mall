<template>
  <div class="no-history">
    <span class="line" :style="bgStyle"></span>
    <span class="text" :style="colorStyle">{{text}}</span>
    <span class="line" :style="bgStyle"></span>
  </div>
</template>

<script>
  export default {
    name: "no-history",
    props:{
      text:{
        type:String,
        default:'暂时没有历史记录'
      },
      contentColor:{
        type:String,
        default:'#808080'
      }
    },
    computed:{
      colorStyle(){
        let {contentColor}=this;
        return {
          color:contentColor
        }
      },
      bgStyle(){
        let {contentColor}=this;
        return {
          background:contentColor
        }
      }
    },
    components: {}
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';
  .no-history{
    padding:20px 0;
    width:100%;
    #flexStyle(center,center);
    .line{
      width:100px;
      height:1px;
    }
    .text{
      padding:0 20px;
      font-size:@middleFont;
    }
  }
</style>
