<template>
  <div class="poster" @click="_toLinkPage">
    <img :src="posterData.imgUrl" alt="">
  </div>
</template>

<script>
  import {Poster} from '../../baseClass/index/indexDecoration'
  export default {
    name: "poster",
    data(){
      return {
        posterData:null
      }
    },
    props:{
      data:{
        type:Array,
        default:()=>[]
      }
    },
    created(){
      this._initPosterData();
    },
    methods:{
      _initPosterData(){
        let {data}=this;
        this.posterData=new Poster(data[0]);
      },
      _toLinkPage(){
        let {linkUrl}=this.posterData;
        if(linkUrl){
          this.$router.push(linkUrl)
        }
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
.poster{
  width:100%;
  &>img{
    width:100%;
    display: block;
  }
}
</style>
