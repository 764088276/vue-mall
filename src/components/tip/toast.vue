<template>
  <div class="toast animated fadeIn" v-show="isShow">
    <span>{{text}}</span>
  </div>
</template>

<script>

  export default {
    name: "toast",
    data(){
      return {
        isShow:false,
        text:'没有搜索结果~'
      }
    },
    methods:{
      showToast(opts){
        clearTimeout(this.timer);
        this.isShow=true;
        this.text=opts.text;
        let duration=opts.duration||1500;
        this.timer=setTimeout(()=>{
          this.isShow=false;
        },duration)
      }
    },
    components: {}
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';
  @import 'animate.css';
  .toast{
    padding:12px 40px;
    max-width:300px;
    #positionStyle(fixed,50%,50%);
    display: block;
    transform:translate(-50%,-50%);
    z-index:1000;
    background: rgba(0,0,0,0.7);
    font-size: @middleFont;
    color:#fff;
    border-radius:14px;
  }
</style>
