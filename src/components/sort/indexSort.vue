<template>
  <scroll scroll-height="auto" :is-y-scroll='false' class="sort-container" :need-click="true" ref="sortScroll">
    <div class="index-sort" ref="indexSort" :class="numClass">
      <div
        class="sort-item"
        :style="sortItemWidth"
        v-for="(sort,index) in sortArr"
        :key="index"
        @click="_toSearch(sort.name)"
      >
        <img :src="sort.imgUrl" alt="" class="sort-img">
        <div class="sort-text">
          <span>{{sort.name}}</span>
        </div>
      </div>
    </div>
  </scroll>
</template>

<script>
  import scroll from '../tip/scroll/scroll'

  export default {
    name: "indexSort",

    props: {
      sortArr: {
        type: Array,
        default: () => [1,2,4,3]
      }
    },
    data() {
      return {
        lineNum: 5
      }
    },
    computed: {
      //每一个sort的宽度
      sortItemWidth() {
        return {
          width: 750 / (this.lineNum) + 'px'
        }
      },
      //根据sort的个数添加对应的class
      numClass(){
        let {sortArr}=this;
        if(sortArr.length<4){
          return 'three'
        }else if(sortArr.length==4){
          return 'four'
        }else{
          return ''
        }
      }
    },
    mounted() {
      this._initSort();
    },
    methods: {
      _initSort() {
        this._setWidth();
        this.$refs.sortScroll.refresh()
      },
      _setWidth() {
        let {sortArr, lineNum} = this;
        let sortNum = sortArr.length;
        let indexSort = this.$refs.indexSort;
        let sortWidth = 0;
        let oneSortWidth = 750 / lineNum;

        if (sortNum <= lineNum) {
          sortWidth = 750;
        } else {
          for (let i = 0; i < sortNum; i++) {
            sortWidth += oneSortWidth;
          }
        }
        indexSort.style.width = sortWidth + 'px';
      },
      _toSearch(name){
        this.$router.push({
          name:'search',
          query:{
            keyword:name,
            searchType:2
          }
        })
      }
    },
    components: {
      scroll
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';
  .sort-container{
    margin-top:14px;
  }
  .index-sort {
    display: flex;
    .sort-item{
      padding:10px;
      box-sizing:border-box;
      #flexStyle(center);
      flex-wrap:wrap;
      font-size:24px;
      &>img{
        width:100px;
        height:100px;
        border-radius:50%;
      }
      .sort-text{
        width:100px;
        overflow:hidden;
        display: -webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
        line-height:30px;
        max-height:60px;
        text-align: center;
        margin-top:10px;
      }
    }
    &.three{
      #flexStyle(center);
      .sortItem{
        margin:0 20px;
      }
    }
    &.four{
      #flexStyle(space-between);
    }
  }
</style>
