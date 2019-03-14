<template>
  <div class="back" @click="_backPage">
    <span class="iconfont icon-back"></span>
  </div>
</template>

<script>
  export default {
    name: "back",
    components: {},
    methods:{
      _backPage(){
        this.$emit('back');
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../../assets/less/common.less';

  .back {
    width: 60px;
    height: 100%;
    #flexStyle(center, center);

    .icon-back {
      font-size: 38px;
      display: block;
    }
  }
</style>
