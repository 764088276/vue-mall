<template>
  <div class="brand-wall">
    <block-title title="入驻品牌"></block-title>
    <div class="brand-content">
      <div class="brand-item" v-for="(brand,index) in brandData" :key="index" @click="_toSearch(brand.brandName)">
        <img :src="brand.brandImg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import blockTitle from '../item/block-title'
  import {Brand} from '../../baseClass/index/indexDecoration'

  export default {
    name: "brand",
    data(){
      return {
        brandData:[]
      }
    },
    props:{
      data:{
        type:Array,
        default:()=>[]
      }
    },
    created(){
      let {data:_data}=this;
      _data.forEach(item=>{
        this.brandData.push(new Brand(item))
      })
    },
    methods:{
      _toSearch(brandName){
        this.$router.push({
          name:'search',
          query:{
            keyword:brandName,
            searchType:5
          }
        })
      }
    },
    components: {
      blockTitle
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';
  .brand-wall {
    width: 100%;
    .brand-content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .brand-item{
        width:25%;
        height:185px;
        padding:10px;
        box-sizing:border-box;
        & >img{
          width:100%;
          height:165px;
          box-sizing:border-box;
          border:1px solid @grayColor;
        }
      }
    }
  }
</style>
