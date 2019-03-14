<template>
  <div class="block-title">
    <span class="line left-line"></span>
    <span class="text">{{title}}</span>
    <span class="line right-line"></span>
  </div>
</template>

<script>
  export default {
    name: "block-title",
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .block-title {
    width: 100%;
    #flexStyle(center, center);
    height: 70px;
    font-size: 32px;
    color: @defaultColor;
    padding: 0 15px;
    box-sizing: border-box;
    .line {
      flex: 1;
      height: 2px;
      background: @defaultColor;
      position: relative;

      &::after {
        content: '';
        width: 12px;
        height: 12px;
        border: 1px solid @defaultColor;
        border-radius: 50%;
        display: block;
        position: absolute;
        top: 50%;
      }
      &.left-line::after {
        right: 0;
        transform: translate(100%, -50%);
      }
      &.right-line::after {
        left: 0;
        transform: translate(-100%, -50%);
      }
    }
    .text {
      padding: 0 40px;
    }
  }
</style>
