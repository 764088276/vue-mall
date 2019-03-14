<template>
  <transition name="slide">
    <div class="search" v-if="isShow">
      <div class="search-wrapper">
        <searchBar
          @inputEmpty="_inputEmpty"
          @search="_startSearch"
          ref="searchBar"
        ></searchBar>
      </div>
      <div class="search-content with-mock-search">
        <div class="history" v-show="!showSearchResult">
          <div class="title">
            <span>历史记录</span>
            <span class="iconfont icon-clear" @click="_clearHistory">清空</span>
          </div>
          <div class="history-content">
            <ul class="history-list" v-if="historyList.length">
              <li
                class="history-item"
                v-for="(item, index) in historyList"
                :key="index"
                :data-index="index"
                @click="_setKeyword(item)"
                @touchstart="_startDeleteItem"
                @touchend="_endDeleteItem"
              >
                {{item}}
              </li>
            </ul>
            <div class="no-history-container" v-if="!historyList.length">
              <no-history></no-history>
            </div>
          </div>
        </div>
        <div class="search-result" v-show="showSearchResult">
          <sort-bar
          @sortChange="_sortGoodList"
          v-show="showSearchList.length"
          ></sort-bar>
          <div class="result-list" v-show="showSearchList.length">
            <scroll ref="goodScroll" :pull-up-load="true" @pullingUp="_scrollToEnd">
              <div class="scroll-container-wrapper">
                <good-list
                  :good-list="showSearchList"
                ></good-list>
                <no-history text="我是有底线的 (๑• . •๑)" v-show="isReachBottom"></no-history>
                <bottom-loading v-show="showBottomLoading"></bottom-loading>
              </div>
            </scroll>
          </div>
          <div class="no-result-container">
            <no-result text="没有相应的搜索结果" v-show="!showSearchList.length"></no-result>
          </div>
        </div>
      </div>
      <toast ref="toast"></toast>
      <loading ref="loading"></loading>
      <confirm ref="confirm"></confirm>
    </div>
  </transition>
</template>

<script>
  import searchBar from '../../components/search/search-bar'
  import noResult from '../../components/tip/no-result/no-result'
  import noHistory from '../../components/search/no-history'
  import toast from '../../components/tip/toast'
  import goodList from '../../components/list/good-list'
  import loading from '../../components/tip/loading/loading'
  import confirm from '../../components/tip/confirm'
  import scroll from '../../components/tip/scroll/scroll'
  import bottomLoading from '../../components/tip/bottom-loading'
  import sortBar from '../../components/search/sort-bar'

  import getSearchResult from '../../getData/search/search'

  import GoodItem from '../../baseClass/good/goodItem'

  import storage from '../../utils/tool/storage'

  export default {
    name: "search",
    data() {
      return {
        isShow: true,
        historyList: [],
        //是否显示搜索结果
        showSearchResult: false,
        curPage: 1,
        totalPage: 1,
        //保存原始的搜索结果数组
        originSearchList: [],
        //保存显示在页面的搜索结果数组
        showSearchList: [],
        keyword: '',
        //搜索类型，1名称，2分类，5品牌
        searchType: 1,
        isSearching: false,
        //是否显示bottomLoading
        showBottomLoading: false,
        //是否已经显示完全数据
        isReachBottom: false,
        //当前的排序类型
        sortType:0,
        isTypeUp:false
      }
    },
    components: {
      searchBar,
      noResult,
      noHistory,
      toast,
      goodList,
      loading,
      confirm,
      scroll,
      bottomLoading,
      sortBar
    },
    created() {
      this._getHistoryList();
    },
    mounted() {
      this.toast = this.$refs.toast;
      this.loading = this.$refs.loading;
      this.searchBar = this.$refs.searchBar;
      this.confirm = this.$refs.confirm;
      this.goodScroll = this.$refs.goodScroll;
      this._getKeyword();
    },
    methods: {
      //获取来自外界的query
      _getKeyword(){
        let query=this.$route.query;
        this.searchType=query.searchType||1;
        let {keyword}=query;
        if(keyword){
          this.searchBar.setKeyword(keyword)
          this._startSearch(keyword);
        }
      },
      _getHistoryList() {
        this.historyList = storage.getItem('history') || [];
      },
      //开始执行搜索操作
      _startSearch(inputValue) {

        let _keyWord = inputValue.trim();
        let {keyword, isSearching} = this;
        //如果正在搜索，不执行
        if (isSearching) {
          return false
        }
        if (!_keyWord) {
          this.toast.showToast({
            text: '请输入搜索关键词'
          });
          return false
        }
        //如果前后关键词相同，不搜索
        if (keyword == _keyWord) {
          return false
        }
        this.loading.showLoading();
        this._initCondition();
        this.keyword = _keyWord;
        this._getSearchResult().then(() => {
          this.loading.hideLoading();
          this.showSearchResult = true;
          this._putDataStorage(_keyWord);
          this.goodScroll.refresh()
        });
      },
      //触发滚动到底部加载数据
      _scrollToEnd() {
        let {curPage, totalPage, originSearchList, showSearchList} = this;
        curPage++;
        if (curPage > totalPage) {
          this._loadEnd();
          this._finishPullLoad();
          return false
        }
        this.curPage = curPage;
        this.showBottomLoading = true;
        this.goodScroll.refresh();
        this._getSearchResult().then(() => {
          this.showBottomLoading = false;
          this._finishPullLoad();
        })
      },
      //上拉加载完毕
      _finishPullLoad() {
        this.goodScroll.finishPullUp();
        this.goodScroll.refresh();
      },
      //重置搜索条件
      _initCondition() {
        this.showSearchList = [];
        this.originSearchList = [];
        this.curPage = 1;
        this.totalPage = 1;
        this.showBottomLoading = false;
        this.isReachBottom = false;
      },
      //对goodList进行排序
      _sortGoodList(sortData){
        let {type,isTypeUp}=sortData;
        let {originSearchList,showSearchList}=this;
        this.sortType=type;
        this.isTypeUp=isTypeUp;
        if(type==0){
          this.showSearchList=originSearchList;
          return false
        }
        this._sortCurGoodList();
      },
      //根据当前的排序类型进行排序
      _sortCurGoodList(){
        let {sortType,isTypeUp}=this;
        if(sortType==0){
          return false
        }
        this.showSearchList.sort((prev,next)=>{
          let sort=sortType==1?'saleNums':'sellPrice';
          let num1=parseFloat(prev[sort]);
          let num2=parseFloat(next[sort]);
          return (isTypeUp?1:-1)*(num1-num2)
        })
      },
      //获取搜索结果
      _getSearchResult() {
        let {curPage, searchType, keyword} = this;
        this.isSearching = true;
        return new Promise(resolve => {
          let searchData = {
            searchType,
            cateName: keyword,
            page: curPage
          };
          getSearchResult(searchData).then(res => {
            if (res.data.code == 200) {
              let resData = res.data.data[0];
              if (resData) {
                let resultList = resData.getGoodsLists;
                this.totalPage = resData.total_page;
                this.curPage = this.curPage + 1;
                this._putSearchData(resultList);
              }
              this.isSearching = false;
              resolve()
            }
          })
        });
      },
      //将每次搜索的数据放入本地存储
      _putDataStorage(keyword) {
        let {historyList} = this;
        let _index = historyList.indexOf(keyword)
        if (_index > -1) {
          historyList.splice(_index, 1);
        }
        historyList.unshift(keyword);
        this.historyList = historyList;
        storage.setItem('history', historyList);
      },
      //点击历史搜索进行搜索
      _setKeyword(keyword) {
        this.searchBar.setKeyword(keyword);
      },
      //实现长按删除记录
      _startDeleteItem(e){
        let {index}=e.target.dataset;
        this.deleteTimer=setTimeout(()=>{
          this._deleteHistoryItem(index)
        },500);
      },
      _endDeleteItem(){
        clearTimeout(this.deleteTimer)
      },
      //清除单个历史记录
      _deleteHistoryItem(index){
        this.confirm.showConfirm({
          text:'确定删除该搜索记录吗',
          success:()=>{
            this.historyList.splice(index,1);
            storage.setItem('history',this.historyList);
          }
        });
      },
      //清空历史记录
      _clearHistory() {
        this.confirm.showConfirm({
          text: '确定要清空所有历史记录吗',
          success: () => {
            storage.removeItem('history');
            this.historyList = [];
          }
        });
      },
      //将获取的数据放入searchList中
      _putSearchData(searchList) {
        let {originSearchList, showSearchList} = this;
        if (!searchList.length) {
          return false
        }
        searchList.forEach(item => {
          let goodItem = new GoodItem(item);
          originSearchList.push(goodItem);
          showSearchList.push(goodItem);
        });
        this.originSearchList = originSearchList;
        this.showSearchList = showSearchList;
        this._sortCurGoodList();
      },
      //数据已经到底了
      _loadEnd() {
        this.goodScroll.refresh()
        this.isReachBottom = true;
      },
      _inputEmpty() {
        this.showSearchResult = false;
        this.keyword = '';
        this.searchType=1;
      }
    },
    watch:{
      $route(to,from){
        this._getKeyword();
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .search {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 1000;
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.5s;
  }

  .slide-enter, .slide-leave-to {
    left: 100%;
  }
  .search-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
  }



  .search-wrapper {
    border-bottom: 1px solid @grayColor;
  }

  .search-content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-size: 30px;

    .history {
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
      .title {
        #flexStyle(space-between, center);
        .iconfont {
          font-size: @largeFont;
        }
      }
      .history-content {
        margin-top: 20px;

        .history-list {
          display: flex;
          flex-wrap: wrap;

          .history-item {
            line-height: 50px;
            border-radius: 25px;
            padding: 0 20px;
            background: @lightGrayColor;
            font-size: @middleFont;
            margin: 0 20px 14px 0;
          }
        }
        .no-history-container {
          width: 100%;
          margin-top: 60px;
        }
      }
    }
    .search-result {
      width: 100%;
      height: 100%;
      position: relative;
      padding-top: 71px;
      box-sizing:border-box;

      .sort-bar {
        #positionStyle(absolute, 0, 0);
        z-index: 100;
      }

      .result-list {
        height: 100%;
      }
    }
  }

  .no-result-container {
    width: 100%;
    padding: 60px 0;
  }
</style>
