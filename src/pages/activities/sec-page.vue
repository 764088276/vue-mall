<template>
  <transition name="slide">
    <div class="sec-page page-container with-pagetitle">
      <page-title :title="pageTitle"></page-title>
      <scroll ref="scroll">
        <div class="page-content">
          <all-type v-for="(item,index) in decoData" :key="index" :deco-data="item"></all-type>
        </div>
      </scroll>
      <loading ref="loading"></loading>
    </div>
  </transition>

</template>

<script>
  import pageTitle from '../../components/item/page-title'
  import allType from '../../components/decoration/all-type'
  import scroll from '../../components/tip/scroll/scroll'
  import loading from '../../components/tip/loading/loading'

  import decorationType from '../../utils/map/decorationType'

  import getIndexLocation from '../../getData/index/indexDecorationData'

  export default {
    name: "sec-page",
    data() {
      return {
        pageTitle: '',
        decoData: [],
        curDecoIndex: 0
      }
    },
    components: {
      pageTitle,
      allType,
      scroll,
      loading
    },
    mounted() {
      this._initComponents();
      this._initContent();
    },
    methods: {
      _initContent() {
        this._getTitle();
        this.loading.showLoading();
        this._getDecoList().then(() => {
          this.loading.hideLoading();
          this.scroll.refresh()
        })
      },
      _initComponents() {
        this.loading = this.$refs.loading;
        this.scroll = this.$refs.scroll;
      },
      _getTitle() {
        this.pageTitle = this.$route.query.title;
      },
      async _getDecoList() {
        let pageTitle = this.pageTitle;
        let data = {
          title: pageTitle,
          pageType: 'second'
        };
        let resData = await getIndexLocation(data);
        resData = resData.data.data[0];
        if (resData) {
          let decoList = resData.all;
          //co也是promise，yield会函数暂停到co状态变化，也就是等到co中的_getDecoDetail函数return
          await this._getDecoDetail(decoList)
        }
      },
      async _getDecoDetail(decoList) {
        let {curDecoIndex, pageTitle} = this;
        if (curDecoIndex >= decoList.length) {
          return
        }
        let curDeco = decoList[curDecoIndex];
        let activeName = decorationType(curDeco.page_seq_table);
        let data = {
          activeName,
          subId: curDeco.sub_id,
          title: pageTitle,
          pageType: 'second'
        };
        this.curDecoIndex++;
        let resData = await getIndexLocation(data);
        let decoData = resData.data.data[0][activeName];
        this.decoData.push({
          type: activeName,
          data: decoData
        });
        await this._getDecoDetail(decoList);
      }
    },
    watch: {}
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  .page-content{
    height:auto;
  }
</style>
