<template>
  <div class="bottom-loading">
    <img src="../../assets/images/bottom-loading.gif" alt="">
    <span class="text">努力加载中...</span>
  </div>
</template>

<script>
  export default {
    name: "bottom-loading",
    components: {}
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .bottom-loading{
    #flexStyle(center,center);
    height:60px;
    color:@grayColor;
    font-size: @largeFont;
    line-height: @largeFont;
    >img{
      width:32px;
      height:32px;
      margin-right:10px;
    }
  }
</style>
