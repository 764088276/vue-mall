<template>
  <div class="scroll-container" ref="scroll" :style="scrollStyle">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  export default {
    name: "scroll",
    props: {
      scrollHeight: {
        type:String,
        default:'100%'
      },
      isYScroll:{
        type:Boolean,
        default:true
      },
      needClick:{
        type:Boolean,
        default:true
      },
      pullUpLoad:{
        type:Boolean,
        default:false
      },
      eventPassthrough:{
        type:String,
        default:''
      }
    },
    computed:{
      scrollStyle(){
        return {
          height:this.scrollHeight
        }
      }
    },
    mounted() {
      this._initScroll();
    },

    methods: {
      _initScroll() {
        let scrollEle = this.$refs.scroll;
        this.bscroll = new BScroll(scrollEle, {
          scrollX: !this.isYScroll,
          scrollY: this.isYScroll,
          click:this.needClick,
          pullUpLoad:this.pullUpLoad,
          eventPassthrough:this.eventPassthrough
        });
        this._setEvent();
      },
      //根据配置设置对应的事件
      _setEvent(){
        if(this.pullUpLoad){
          this.bscroll.on('pullingUp',()=>{
            this.$emit('pullingUp');
          })
        }
      },
      refresh() {
        setTimeout(()=>{
          this.bscroll.refresh();
        },50)
      },
      finishPullUp(){
        this.bscroll.finishPullUp();
      }
    }
  }
</script>

<style scoped>
  .scroll-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
