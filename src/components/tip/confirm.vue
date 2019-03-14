<template>
  <div class="confirm-layer outer-layer" v-if="showLayer">
    <div class="layer-bg" @click.stop></div>
    <div class="layer-container">
      <div class="text-content">
        {{text}}
      </div>
      <div class="btns">
        <div class="btn cancel" @click.stop="_closeLayer">
          <span>取消</span>
        </div>
        <div class="btn sure" @click.stop="_sureFn">
          <span>确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import layerCloseMixins from '../../mixins/layerClose'

  export default {
    name: "confirm",
    mixins: [layerCloseMixins],
    data(){
      return {
        text:'',
        showLayer:false
      }
    },
    methods:{
      showConfirm(options){
        this.showLayer=true;
        this.text=options.text||'';
        this._confirmSure=options.success||'';
      },
      _sureFn(){
        if(this._confirmSure){
           this._confirmSure()
        }
        this._closeLayer();
      }
    },
    components: {},
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';
  @import '../../assets/less/animation.less';
  .layer-container{
    width:60%;
    border-radius:26px;
    font-size:@largeFont;
    box-shadow: 0 0 10px 3px @grayColor;
    animation:fadeDown 0.5s forwards;


    .text-content{
      width:100%;
      padding:34px;
      box-sizing:border-box;
    }

    .btns{
      width:100%;
      display: flex;
      border-top:1px solid #ccc;

      .btn{
        width:50%;
        text-align: center;
        line-height: 70px;
        &:first-child{
          border-right:1px solid #ccc;
        }
        &.sure{
          color:@defaultColor;
        }
      }
    }
  }
</style>
