<template>
  <div class="recom-list" v-if="recomList.length">
    <block-title title="相关推荐"></block-title>
    <div class="good-list-container">
      <good-list :good-list="$options.filters.getEvenList(recomList)"></good-list>
    </div>
  </div>
</template>

<script>
  import blockTitle from '../item/block-title'
  import goodList from './good-list'

  import getRecomGood from '../../getData/good/getRecomList'

  import GoodItem from '../../baseClass/good/goodItem'

  export default {
    name: "recom-list",
    data(){
      return {
        recomList:[]
      }
    },
    components: {
      blockTitle,
      goodList
    },
    created(){
      this._getRecomGood();
    },
    methods:{
      _getRecomGood(){
        getRecomGood().then(res=>{
          if(res.data.code==200){
            let resData=res.data.data[0].goodslist;
            resData.forEach(item=>{
              this.recomList.push(new GoodItem(item))
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>

</style>
