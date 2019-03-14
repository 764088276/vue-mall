<template>
  <div class="picker-layer">
    <div class="picker-layer-bg"></div>
    <div class="picker-container">
      <div class="picker-handler">
        <span class="cancel handler-item">
          取消
        </span>
        <span class="picker-title">
          pickerpickerpickerpickerpicker
        </span>
        <span class="confirm handler-item">
          确定
        </span>
      </div>
      <div class="picker-wrapper">
        <!--<div class="top-mask mask-item"></div>-->
        <div class="wheel-wrapper">
          <div class="wheel-item">
            <div class="item" v-for="(item,index) in wheelStyle" :key="index" :class="{active:curIndex==index}" :style="item">{{index}}</div>
          </div>
          <div class="wheel-item">3</div>
          <div class="wheel-item">4</div>
        </div>
        <!--<div class="bottom-mask mask-item"></div>-->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "picker",
    components: {},
    data(){
      return {
        wheelPos:new Array(56).fill(1),
        wheelStyle:[],
        appWidth:750,
        curIndex:0
      }
    },
    mounted(){
      this._initRotate();
    },
    methods:{
      _initPicker(){

      },
      _initRotate(){
        let {wheelPos,appWidth}=this;
        let len=wheelPos.length;
        let lineHeight=60;
        let angle=360/len;
        let radius=lineHeight/2/Math.tan(angle/2*Math.PI/180);
        wheelPos.forEach((item,index)=>{
          let curAngle=(-1)*index*angle;
          let style={
            lineHeight:lineHeight+'px',
            transformOrigin:`${appWidth/6}px ${lineHeight/2}px -${radius}px`,
            transform:`translateZ(${radius}px) rotateX(${curAngle}deg)`
          };
          this.wheelStyle.push(style);
        })
      }
    }
  }
</script>

<style scoped>
  .picker-layer {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .picker-layer-bg {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .picker-container {
    width: 100%;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 32px;
  }

  .picker-handler {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  .picker-handler .handler-item {
    width: 18%;
    text-align: center;
  }

  .picker-handler .handler-item.cancel {
    color: gray;
  }

  .picker-handler .handler-item.confirm {
    color: #1aad19;
  }

  .picker-handler .picker-title {
    width: 50%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .picker-wrapper {
    width: 100%;
    height: 500px;
    position: relative;
    overflow:hidden;
  }
  .wheel-wrapper{
    width:100%;
  }

  .picker-wrapper .top-mask {
    top: 0;
    background: linear-gradient(bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 1));
  }

  .picker-wrapper .wheel-wrapper {
    position: absolute;
    width: 100%;
    top: calc((100% - 60px) / 2);
    left: 0;
    display: flex;
    justify-content: space-between;
    line-height: 60px;
    height:60px;
    border-top:1px solid #ccc;
    border-bottom:1px solid #ccc;
  }

  .picker-wrapper .wheel-wrapper .wheel-item {
    width: 33.33%;
    text-align: center;
    height:100%;
    position:relative;
    background: #fff;
  }
  .picker-wrapper .wheel-wrapper .wheel-item .item{
    width:100%;
    height:100%;
    line-height: 60px;
    color:#333;
    position:absolute;
    top:0;
    left:0;
    backface-visibility:hidden;

  }
  .picker-wrapper .bottom-mask {
    bottom: 0;
    background: linear-gradient(top, rgba(255, 255, 255, 0.6), rgba(255, 255, 255,1));
  }
</style>
