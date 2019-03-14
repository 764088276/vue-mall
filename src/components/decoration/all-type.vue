<template>
  <div class="all-type">
    <catelog  v-if="decoData.type=='catelog'" :data="decoData.data"></catelog>
    <brand v-if="decoData.type=='brand'" :data="decoData.data"></brand>
    <poster v-if="decoData.type=='poster'" :data="decoData.data"></poster>
  </div>
</template>

<script>
  import catelog from './catelog'
  import poster from './poster'
  import brand from './brand'

  export default {
    name: "all-type",
    components:{
      catelog,
      poster,
      brand
    },
    props:{
      decoData:{
        type:Object,
        default:()=>{}
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>

</style>
