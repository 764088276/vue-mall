<template>
  <div class="mock-search-bar"
  @click.stop="toSearchPage"
  >
    <div class="search-bar-container">
      <span class="iconfont icon-search"></span>
      <span class="text">搜索商品</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "mock-search-bar",
    methods:{
      toSearchPage(){
        this.$emit('clickSearch')
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import '../../assets/less/common.less';
  .mock-search-bar{
    width:100%;
    #positionStyle(fixed,0,0);
    background: #fff;
    #flexStyle(center);
    padding:20px 0;
    z-index:10;

    .search-bar-container{
      border-radius:28px;
      height:66px;
      background: #f4f4f4;
      width:96%;
      #flexStyle(center,center);
      font-size: 30px;
      color:@grayColor;

      .icon-search{
        font-size:30px;
        margin-right:6px;
      }
    }
  }
</style>
