<template>
  <div class="sort-bar">
    <div class="sort-item" :class="{active:curSortType==0}" @click="_changeType(0)">
      <span>综合</span>
    </div>
    <div class="sort-item" :class="{active:curSortType==1}" @click="_changeType(1)">
      <span>销量</span>
      <span class="iconfont icon-shangbiao" v-show="isTypeUp"></span>
      <span class="iconfont icon-xiabiao" v-show="!isTypeUp"></span>
    </div>
    <div class="sort-item" :class="{active:curSortType==2}" @click="_changeType(2)">
      <span>价格</span>
      <span class="iconfont icon-shangbiao" v-show="isTypeUp"></span>
      <span class="iconfont icon-xiabiao" v-show="!isTypeUp"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "sort-bar",
    data(){
      return {
        curSortType:0,
        isTypeUp:false
      }
    },
    methods:{
      _changeType(type){
        let {curSortType,isTypeUp}=this;
        if(curSortType==0&&type==0){
          return false
        }
        if(type!=0){
          this.isTypeUp=!isTypeUp;
        }
        this.curSortType=type;
        this.$emit('sortChange',{
          type,
          isTypeUp
        })
      }
    },
    components: {}
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .sort-bar {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid @grayColor;
    width: 100%;

    .sort-item {
      width: 33%;
      height: 50px;
      #flexStyle(center, center);
      border-right: 1px solid @grayColor;
      box-sizing: border-box;
      font-size: @largeFont;

      .iconfont{
        margin-left:6px;
      }

      &:last-child {
        border: 0 none;
      }

      &.active {
        > span {
          color: @defaultColor
        }
      }
    }
  }
</style>
