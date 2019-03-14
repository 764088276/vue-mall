<template>
  <div class="index-container">
    <facebook-loader
      primaryColor="#ccc"
      :speed=2
      :animate=false
    ></facebook-loader>
    <mock-search-bar @clickSearch="toSearch"></mock-search-bar>
    <scroll ref="wholeScroll" :need-click="true">
      <div class="scroll-wrapper">
        <banner :img-arr="bannerData" v-if="bannerData.length"></banner>
        <indexSort :sort-arr="indexSortData" v-if="indexSortData.length"></indexSort>
        <div class="decoration-data">
          <all-type
            :deco-data="item"
            v-for="(item,index) in decorationData"
            :key="index"
          ></all-type>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import scroll from '../../components/tip/scroll/scroll'
  import mockSearchBar from '../../components/search/mock-search-bar'
  import banner from '../../components/banner/banner'
  import indexSort from '../../components/sort/indexSort'
  import goodList from '../../components/list/good-list'
  import allType from '../../components/decoration/all-type'
  import {
    ContentLoader,
    FacebookLoader,
    CodeLoader,
    BulletListLoader,
    InstagramLoader,
    ListLoader
  } from 'vue-content-loader'

  import getBannerData from '../../getData/banner/getBannerData'
  import getIndexLocation from '../../getData/index/indexDecorationData'

  import Banner from '../../baseClass/banner/banner'
  import {SortItem} from '../../baseClass/index/indexDecoration'

  import decorationType from '../../utils/map/decorationType'

  export default {
    name: "index",
    data() {
      return {
        bannerData: [],
        indexSortData: [],
        //当前数据获取到的索引
        curDataIndex: 0,
        //首页自定义装修的数据
        decorationData: []
      }
    },
    components: {
      scroll,
      mockSearchBar,
      banner,
      indexSort,
      goodList,
      allType,
      ContentLoader,
      FacebookLoader,
      CodeLoader,
      BulletListLoader,
      InstagramLoader,
      ListLoader
    },
    created() {
      this.globalGetData();
      this._initIndexData();
    },
    methods: {
      _initIndexData() {
        this._getBannerData()
          .then(() => {
            return this._getIndexSortData()
          })
          .then(() => {
            return this._getAllDataLocation()
          })
          .then(() => {
            this.refreshScroll()
          })
      },
      //获取banner图数据
      _getBannerData() {
        return new Promise(resolve => {
          getBannerData().then(res => {
            if (res.data.code == 200) {
              let resData = res.data.data[0];
              if (resData) {
                let bannerList = resData.getBannerList;
                bannerList.forEach(item => {
                  this.bannerData.push(new Banner(item))
                })
              }
            }
            resolve()
          })
        })
      },
      //获取分类数据
      _getIndexSortData() {
        let data = {
          activeName: 'classify',
          subId: 1
        };
        return new Promise(resolve => {
          getIndexLocation(data).then(res => {
            if (res.data.code == 200) {
              let resData = res.data.data[0];
              if (resData) {
                resData.classify.forEach(item => {
                  this.indexSortData.push(new SortItem(item));
                })
              }
            }
            resolve();
          })
        })

      },
      //获取首页自定义装修的所有数据类型
      _getAllDataLocation() {
        return new Promise(resolve => {
          getIndexLocation().then(res => {
            if (res.data.code == 200) {
              let resData = res.data.data[0] ? res.data.data[0].all : [];
              this._getSingleData(resData).then(() => {
                resolve()
              })
            }
          })
        })
      },
      //获取首页自定义装修各部分的代码
      _getSingleData(decorationData) {
        return new Promise(resolve => {
          let {curDataIndex} = this;
          //如果数据全部获取到了resolve
          if (decorationData.length <= curDataIndex) {
            console.log('decorationData', this.decorationData);
            resolve();
            return true
          }
          let curData = decorationData[curDataIndex];
          let activeName = decorationType(curData.page_seq_table);
          let subId = curData.sub_id;
          let reqData = {
            activeName, subId
          };
          getIndexLocation(reqData).then(res => {
            if (res.data.code == 200) {
              this.curDataIndex++;
              let resData = res.data.data[0] ? res.data.data[0][activeName] : null;
              if (resData) {
                this.decorationData.push({
                  type: activeName,
                  data: resData
                });
                this._getSingleData(decorationData).then(() => {
                  resolve()
                });
              }
            }
          })
        })
      },
      //重新刷新better-scroll
      refreshScroll() {
        this.wholeScroll = this.$refs.wholeScroll;
        setTimeout(() => {
          this.wholeScroll.refresh()
        }, 20);
      },
      toSearch() {
        this.$router.push({
          name: 'search'
        })
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .index-container {
    width: 100%;
    height: 100%;
  }

  .scroll-wrapper {
    width: 100%;
    overflow: hidden;
    padding: 96px 0 92px;
  }
</style>
