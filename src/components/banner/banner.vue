<template>
  <div class="banner" ref="banner" :style="{height:bannerHeight}">
    <div class="banner-container" ref="bannerContainer">
      <div class="banner-item" v-for="(banner,index) in imgArr" :key="index">
        <img :src="banner.imgUrl" alt=""/>
      </div>
    </div>
    <ul class="dots">
      <li class="dot" :class="curBannerIndex==index?'active':''" v-for="(dot,index) in imgArr" :key="index"></li>
    </ul>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    name: "banner",

    props: {
      imgArr: {
        type:Array,
        default:()=>[]
      },
      loop:{
        type:Boolean,
        default:true
      },
      autoPlay:{
        type:Boolean,
        default:false
      },
      interval:{
        type:Number,
        default:3000
      },
      bannerHeight:{
        type:String,
        default:'380px'
      }
    },
    data(){
      return {
        appWidth:750,
        curBannerIndex:0
      }
    },
    computed:{},
    mounted(){
      setTimeout(()=>{
        this.setWidth();
        this._initBanner();
        setTimeout(this.setAutoPlay,this.interval);
      },20)

    },
    methods:{
      _initBanner(){
        let bannerRef=this.$refs.banner;
        this.bannerSwiper=new BScroll(bannerRef,{
          scrollX:true,
          scrollY:false,
          snap:{
            loop:this.loop,
            threshold:0.1,
            speed:400
          },
          eventPassthrough:'vertical',
          momentum: false
        });
        this.bannerSwiper.on('scrollEnd',()=>{
          let pageX=this.bannerSwiper.getCurrentPage().pageX;
          this.curBannerIndex=pageX;
          if(this.autoPlay){
            clearTimeout(this.bannerTimer);
            this.bannerTimer=setTimeout(this.setAutoPlay,this.interval);
          }
        });
      },
      setWidth(){
        let {imgArr,appWidth}=this;
        let imgArrLen=imgArr.length;
        let bannerContainer=this.$refs.bannerContainer;
        let width=0;
        for(let i=0;i<imgArrLen;i++){
          width+=appWidth;
        }
        if(this.loop&&imgArrLen>1){
          width+=(2*appWidth)
        }
        bannerContainer.style.width=width+'px'
      },
      //设定自动轮播
      setAutoPlay(){
        this.bannerSwiper.next();
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import '../../assets/less/common.less';
  .banner{
    width:100%;
    height:380px;
    position:relative;
    overflow: hidden;

    .banner-container{
      width:100%;
      height:100%;
      position:relative;

      .banner-item{
        width:750px;
        height:100%;
        float:left;

        &>img{
          width:100%;
          height: 100%;
          display: block;
         }
      }
    }
    .dots{
      width:100%;
      position:absolute;
      bottom:20px;
      #flexStyle(center);
      left:0;
      z-index:10;
      .dot{
        width:16px;
        height:16px;
        border-radius:50%;
        background: #fff;
        margin:0 6px;
        &.active{
          background: #3388ff;
        }
      }
    }
  }
</style>
