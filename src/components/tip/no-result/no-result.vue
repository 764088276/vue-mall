<template>
    <div class="no-result-container">
      <div class="no-result-wrapper">
        <img src="../../../assets/images/no-result.png" alt="">
        <div class="text">
          <span>{{text}}</span>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "no-result",
        props:{
          text:{
            type:String,
            default:'列表中空空如也'
          }
        },
        components: {}
    }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../../assets/less/common.less';
  .no-result-container{
    width:100%;
    #flexStyle(center,center);
    .text{
      font-size:@middleFont;
      color:@grayColor;
      margin-top:20px;
      text-align: center;
    }
  }
</style>
