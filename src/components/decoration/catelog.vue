<template>
  <div class="catelog">
    <blockTitle :title="catelogTitle" v-if="catelogTitle"></blockTitle>
    <scroll scroll-height="auto" :is-y-scroll="!isXScroll" :need-click="true">
      <good-list :three-column="isThreeColumn" :x-scroll="isXScroll" :good-list="catelogData"></good-list>
    </scroll>
  </div>
</template>

<script>
  import blockTitle from '../item/block-title'
  import goodList from '../list/good-list'
  import GoodItem from '../../baseClass/good/goodItem'
  import scroll from '../../components/tip/scroll/scroll'

  export default {
    name: "catelog",
    data(){
      return {
        catelogData:[],
        catelogTitle:'',
        isThreeColumn:false,
        isXScroll:false
      }
    },
    props:{
      data:{
        type:Array,
        default:()=>[]
      }
    },
    created(){
      this._initCatelog();
    },
    methods:{
      _initCatelog(){
        let {data}=this;
        let firstData=data[0];
        this.catelogTitle=firstData.title;
        this.isThreeColumn=firstData.row_goods_num==3?true:false;
        this.isXScroll=firstData.is_slide=='Y'?true:false;
        data.forEach(item=>{
          this.catelogData.push(new GoodItem(item))
        })
      }
    },
    components:{
      blockTitle,
      goodList,
      scroll
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>

</style>
