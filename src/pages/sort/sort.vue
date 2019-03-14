<template>
  <div class="sort-container with-mock-search with-tabbar">
    <mockSearchBar @clickSearch="toSearch"></mockSearchBar>
    <div class="sort-content">
      <div class="first-sort">
        <scroll :needClick="true">
          <ul class="first-sort-container">
            <li
              class="sort-item"
              v-for="(sort,index) in firstSortList"
              :key="index"
              :class='{active:index==curFirstSortIndex}'
              @click.stop="changeSecondSort(sort,index)"
            >
              <span>{{sort.name}}</span>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="right-sort">
        <scroll>
          <div class="right-sort-container">
            <div class="right-sort-item" v-for="(value,key,index) in secondSortList" :key="index">
              <div class="right-sort-title">
                <span>{{key}}</span>
              </div>
              <ul class="right-sort-part">
                <li class="right-sort-icon"
                    v-for="(sortItem,sortIndex) in value"
                    :key="sortIndex"
                    @click="_toSearch(sortItem.name)"
                >
                  <img :src="sortItem.img" alt="">
                  <span class="sort-name">{{sortItem.name}}</span>
                </li>
              </ul>
            </div>
          </div>
        </scroll>
      </div>
    </div>
    <loading ref="loading"></loading>
  </div>
</template>

<script>
  import scroll from '../../components/tip/scroll/scroll'
  import mockSearchBar from '../../components/search/mock-search-bar'
  import loading from '../../components/tip/loading/loading'

  import {getFirstSort, getSecondSort} from "../../getData/sort/getSortData";

  import SortItem from '../../baseClass/sort/sortItem'

  export default {
    name: "sort",
    components: {
      mockSearchBar,
      scroll,
      loading
    },
    data() {
      return {
        //一级分类列表
        firstSortList: [],
        //二级分类列表
        secondSortList: {},
        //当前选中的一级分类
        curFirstSortIndex: 0,
        isLoadingSort:false,
        allSortObj:{}
      }
    },
    mounted(){
      this.loading=this.$refs.loading;
      this._initSort();
    },
    methods: {
      _initSort() {
        this._getFirstSort()
      },
      changeSecondSort(sortItem,index){
        let {curFirstSortIndex,isLoadingSort}=this;
        if(curFirstSortIndex==index||isLoadingSort){
          return false;
        }
        this.curFirstSortIndex=index;
        this.secondSortList={};
        let {cateId}=sortItem;
        if(this._checkIsLoadSort(cateId)){
          return false
        }
        this.loading.showLoading();
        this._getSecondSort(sortItem).then(()=>{
          this.loading.hideLoading();
        })
      },
      //获取一级分类
      _getFirstSort() {
        this.loading.showLoading();
        getFirstSort().then(res => {
          if (res.data.code == 200) {
            let resData = res.data.data[0] ? res.data.data[0].getFirstProductCatelog : [];
            resData.forEach(item => {
              this.firstSortList.push(new SortItem(item));
            });
            let curFirstSort = this.firstSortList[this.curFirstSortIndex];
            this._getSecondSort(curFirstSort).then(()=>{
              this.loading.hideLoading();
            });
          }
        })
      },
      //获取二级分类
      _getSecondSort(sortItem) {
        let {isLoadingSort}=this;
        if(isLoadingSort){
          return false
        }
        this.isLoadingSort=true;
        let {cateId:firstCateId,name}=sortItem;
        this.$set(this.secondSortList,name,[sortItem]);
        return new Promise(resolve=>{
          getSecondSort(firstCateId).then(res => {
            if (res.data.code == 200) {
              let resData = res.data.data[0] ? res.data.data[0].getSecondProductCatelog : [];
              let sortList = [];
              resData.forEach(item => {
                sortList.push(new SortItem(item));
              });
              let sortLen=sortList.length;
              if(!sortLen){
                this.$set(this.allSortObj,firstCateId,this.secondSortList);
                this.isLoadingSort=false;
                resolve()
              }
              sortList.forEach(item=>{
                let {name,cateId}=item;
                this._getThirdSort(cateId).then(sortList=>{
                  sortList.push(item);
                  this.$set(this.secondSortList,name,sortList);
                  let secondSortListLen=Object.keys(this.secondSortList).length;
                  if(secondSortListLen>=sortLen+1){
                    this.$set(this.allSortObj,firstCateId,this.secondSortList);
                    this.isLoadingSort=false;
                    resolve();
                  }
                });
              });
            }
          })
        })
      },
      //获取三级分类
      _getThirdSort(cateId) {
        return new Promise(resolve => {
          getSecondSort(cateId).then(res => {
            if (res.data.code == 200) {
              let resData = res.data.data[0] ? res.data.data[0].getSecondProductCatelog : [];
              let sortList = [];
              resData.forEach(item => {
                sortList.push(new SortItem(item));
              });
              resolve(sortList);
            }
          })
        })
      },
      //判断该数据是否已经加载过了
      _checkIsLoadSort(cateId){
        let {allSortObj}=this;
        let sortData=allSortObj[cateId];
        if(sortData){
          this.secondSortList=sortData;
          return true
        }
        return false
      },
      toSearch(){
        this.$router.push({
          name:'search'
        })
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
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .sort-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;

    .sort-content {
      display: flex;
      width: 100%;
      height: 100%;
      border-top: 1px solid @lightGrayColor;
      box-sizing: border-box;

      .first-sort {
        width: 144px;
        background: @middleGray;

        .sort-item {
          width: 100%;
          padding: 20px 0;
          text-align: center;
          font-size: @middleFont;

          &.active {
            background: #fff;
            color: @defaultColor;
            > span {
              width: 100%;
              display: block;
              border-left: 2px solid @defaultColor;
            }
          }
        }
      }

      .right-sort {
        flex: 1;
        background: #fff;
        height: 100%;

        .right-sort-container {
          width: 100%;
          font-size: @middleFont;
          padding: 0 20px;
          box-sizing: border-box;

          .right-sort-item {
            width: 100%;
            margin-bottom: 4px;

            .right-sort-title {
              width: 100%;
              font-size: 30px;
              line-height: 50px;
              font-weight: 600;
              padding-left: 28px;
              box-sizing: border-box;
            }
            .right-sort-part {
              display: flex;
              flex-wrap: wrap;

              .right-sort-icon {
                width: 130px;
                margin: 10px 28px;
                > img {
                  width: 100%;
                  height: 130px;
                  border-radius: 50%;
                }
                .sort-name {
                  width: 100%;
                  display: block;
                  line-height: 34px;
                  height: 68px;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
