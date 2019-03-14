<template>
  <div class="page-title" :style="titleStyle">
    <back class="_back" v-if="showBack" @back="_pageBack"></back>
    <h1>{{title}}</h1>
  </div>
</template>

<script>
  import back from '../tip/back/back';

  export default {
    name: "page-title",
    props: {
      title: {
        type: String,
        default: '标题'
      },
      bgColor:{
        type:String,
        default:'#fff'
      },
      isShowBack:{
        type:Boolean,
        default:true
      }
    },
    data(){
      return {
        showBack:this.isShowBack
      }
    },
    created(){
      this.isNeedBack();
    },
    computed:{
      //标题栏的样式
      titleStyle(){
        let {bgColor}=this;
        return {
          background:bgColor
        }
      }
    },
    methods:{
      //判断是否需要back按钮
      isNeedBack(){
        if(history.length==2&&!history.state){
          this.showBack=false;
        }
      },
      _pageBack(){
        this.$router.back();
      }
    },
    components: {
      back
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .page-title {
    width: 100%;
    #positionStyle(absolute);
    height: 80px;
    #flexStyle(center, center);
    color: #333;
    z-index:100;
    ._back{
      #positionStyle(absolute);
    }
    h1 {
      font-size: 32px;
      width:500px;
      text-overflow:ellipsis;
      white-space:nowrap;
      overflow:hidden;
      text-align: center;
      font-weight: 500;
    }
  }
</style>
