<template>
  <div class="loading-container" v-show="isShow">
    <div class="canvas-wrapper">
      <div class='circle-item' v-for="(item,index) in circleData" :key="index"
           :style="{background:item.bgColor,width:item.width+'px',height:item.width+'px',left:item.x+'px',top:item.y+'px'}"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "loading",
    data() {
      return {
        isShow: false,
        canvasWidth: 80,
        canvasHeight: 80,
        circleData: []
      }
    },
    components: {},
    created(){
      this._createLoading();
    },
    methods: {
      showLoading() {
        this.isShow = true;
      },
      hideLoading() {
        this.isShow = false;
      },
      //获取对应皮肤的rgb值
      _getRgb() {
        let skinType = 0;
        let skinArr = [
          {r: 0, g: 200, b: 0},
          {r: 255, g: 148, b: 0},
          {r: 252, g: 198, b: 0},
          {r: 74, g: 144, b: 226},
          {r: 255, g: 35, b: 64}];
        return skinArr[skinType];
      },
      //绘制loading图
      _createLoading() {
        let {canvasWidth, canvasHeight} = this;
        let curSkin = this._getRgb();
        let angle = 45;
        //圆球数量
        let circleNums = parseInt(360 / angle);
        let opacitySeparate = 1 / circleNums;
        //小圆的半径
        let innerMinCircleRadius = 4;
        let innerMaxCircleRadius = 8;
        let circleDataArr = [];
        let outCircleRadius = (canvasWidth - innerMaxCircleRadius * 2) / 2;
        for (let i = 0; i < circleNums; i++) {
          let curOpacity = opacitySeparate * (i);
          let curFillColor = `rgba(${curSkin.r},${curSkin.g},${curSkin.b},${curOpacity})`;
          let curAngle = i * angle * Math.PI / 180;
          circleDataArr.push({
            width: ((innerMaxCircleRadius - innerMinCircleRadius) / circleNums * (i + 1) + innerMinCircleRadius) * 2,
            x: outCircleRadius * Math.cos(curAngle),
            y: outCircleRadius * Math.sin(curAngle),
            bgColor: curFillColor
          })
        }
        this.circleData = circleDataArr
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>

  .loading-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100 rpx;
    height: 100 rpx;
    background: #fff;
    border-radius: 20 rpx;
    display: flex;
    z-index: 10000000;
  }

  .loading-container .canvas-wrapper {
    margin: auto;
    transform-origin: center center;
    transform: rotate(0);
    display: block;
    animation: canvasRoate 1.4s infinite linear;
  }

  .circle-item {
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }

  @keyframes canvasRoate {
    to {
      transform: rotate(360deg)
    }
  }
</style>
