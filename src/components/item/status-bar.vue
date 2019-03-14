<template>
  <div class="status-bar" v-if="statusArr.length">
    <section
      class="status-item"
      :class="{active:curStatusIndex==index}"
      v-for="(status,index) in statusArr"
      :key="index"
      @click="_clickStatus(index)"
    >
      <span>{{status}}</span>
    </section>
  </div>
</template>

<script>
  export default {
    name: "status-bar",
    props: {
      statusArr: {
        type: Array,
        default: () => []
      }
    },
    data(){
      return {
        curStatusIndex:0
      }
    },
    components: {},
    methods:{
      //点击了订单状态选项
      _clickStatus(index){
        this.$emit('statusChange',index);
      },
      //通过该方法改变当前显示的状态
      changeStatus(index){
        if(this.curStatusIndex==index){
          return
        }
        this.curStatusIndex=index;
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .status-bar {
    width: 100%;
    background: #fff;
    #flexStyle(space-around);
    .status-item {
      text-align: center;
      color: #333;
      font-size: @middleFont;
      height: 90px;
      line-height: 90px;
      box-sizing: border-box;
      #flexStyle(center);
      > span {
        height: 100%;
        padding: 0 10px;
        box-sizing: border-box;
      }
      &.active {
        color: @defaultColor;
        > span {
          border-bottom: 4px solid @defaultColor;
        }
      }
    }
  }
</style>
