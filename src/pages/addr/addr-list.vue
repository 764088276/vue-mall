<template>
  <transition name="slide">
    <div class="addr-list page-container with-pagetitle with-bottom-btn" v-if="isShow">
      <page-title title="地址管理"></page-title>
      <div class="addr-list-container">
        <div class="addr-list" v-if="showPage">
          <section class="addr-item" v-for="(addr,index) in addrList" :key="index">
            <div class="add-info" @click="_chooseAddr(index)">
              <div class="addr-name">
                <div class="left-msg">
                  <div class="default-mark" v-if="addr.isDefault">
                    <span>默认</span>
                  </div>
                  <div class="name">
                    <span>{{addr.receiverName}}</span>
                  </div>
                </div>
                <span class="phone">{{addr.phone}}</span>
              </div>
              <div class="addr-detail">
                <span>{{addr.allAddr}}</span>
              </div>
            </div>
            <div class="addr-handler">
              <div class="set-default" @click="_setDefault(index)">
                <div class="checkbox" v-if="!addr.isDefault">
                  <span class="iconfont icon-gou"></span>
                </div>
                <span v-if="!addr.isDefault">设为默认地址</span>
              </div>
              <div class="right-edit">
                <div class="edit edit-item" @click.stop="_editAddr(addr)">
                  <span class="iconfont icon-edit"></span>
                  <span>编辑</span>
                </div>
                <div class="delete edit-item" @click.stop="_delAddr(index)">
                  <span class="iconfont icon-clear"></span>
                  <span>删除</span>
                </div>
              </div>
            </div>
          </section>
          <no-result v-if="!addrList.length"></no-result>
        </div>
        <div class="bottom-whole-btn add-addr-btn" @click="_addAddr">
          <div class="btn">
            <span>添加新地址</span>
          </div>
        </div>
      </div>
      <loading ref="loading"></loading>
      <toast ref="toast"></toast>
      <confirm ref="confirm"></confirm>
    </div>
  </transition>

</template>

<script>
  import pageTitle from '../../components/item/page-title'
  import noResult from '../../components/tip/no-result/no-result'
  import loading from '../../components/tip/loading/loading'
  import toast from '../../components/tip/toast'
  import confirm from '../../components/tip/confirm'

  import getAddrList from '../../getData/addr/getAddrList'
  import setDefaultAddr from '../../getData/addr/setDefaultAddr'
  import delAddr from '../../getData/addr/delAddr'

  import AddressItem from '../../baseClass/addr/AddressItem'

  export default {
    name: "addr-list",
    components: {
      pageTitle,
      noResult,
      loading,
      toast,
      confirm
    },
    data() {
      return {
        isShow: true,
        addrList: [],
        showPage: false,
        pageFrom:''
      }
    },
    mounted() {
      this.loading = this.$refs.loading;
      this.toast = this.$refs.toast;
      this.confirm = this.$refs.confirm;
      this._initPage();
    },
    methods: {
      _initPage() {
        let {from}=this.$route.query||'';
        this.pageFrom=from;
        this._getAddrList();
      },
      async _getAddrList() {
        this.loading.showLoading();
        var res = await getAddrList();
        this.loading.hideLoading();
        if (res.data.code == 200) {
          let resData = res.data.data[0];
          let addrList = [];
          if (resData) {
            resData.addressid.forEach(item => {
              addrList.push(new AddressItem(item))
            })
          }
          this.addrList = addrList;
        }
        this.showPage = true;
      },
      _addAddr() {
        this.$router.push({
          name: 'add-addr'
        })
      },
      async _setDefault(index) {
        let {addrList} = this;
        let curAddr = addrList[index];
        this.loading.showLoading();
        let res=await setDefaultAddr(curAddr.addrId);
        this.loading.hideLoading();
        if (res.data.code == 200) {
          this.toast.showToast({
            text: '设置默认地址成功！'
          });
          addrList.forEach(item => {
            item.isDefault = false
          });
          curAddr.isDefault = true;
        }
      },
      _delAddr(index) {
        let {addrList} = this;
        let curAddr = addrList[index];
        this.confirm.showConfirm({
          text: '确定删除该地址吗',
          success: () => {
            this.loading.showLoading();
            delAddr(curAddr.addrId).then(res => {
              this.loading.hideLoading();
              if (res.data.code == 200) {
                this.toast.showToast({
                  text: '设置默认地址成功！'
                });
                addrList.splice(index, 1);
              }
            })
          }
        });

      },
      //编辑地址
      _editAddr(addr) {
        let addrMsg = JSON.stringify(addr);
        this.$router.push({
          name: 'add-addr',
          query: {
            addrMsg
          }
        })
      },
      //从创建订单中来，设为默认地址
      _chooseAddr(index){
        let {pageFrom}=this;

        if(!pageFrom){
          return
        }
        this._setDefault(index).then(()=>{
          this.$router.back();
        })
      }
    },
    watch: {
      $route(to) {
        if (to.name == 'addr-list') {
          this._getAddrList();
        }
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .addr-list-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;

    .addr-list {
      width: 100%;
      height: 100%;
      overflow: auto;
      background: @middleGray;

      .addr-item {
        margin-bottom: 12px;
        background: #fff;
        font-size: @middleFont;

        .add-info {
          border-bottom: 1px solid @grayColor;
          width: 100%;
          padding: 26px;
          box-sizing: border-box;
          .addr-name {
            #flexStyle(space-between, center);
            .left-msg {
              #flexStyle('', center);
              .default-mark {
                width: 60px;
                height: 24px;
                border: 1px solid @defaultColor;
                text-align: center;
                line-height: 24px;
                font-size: 18px;
                color: @defaultColor;
                margin-right: 20px;
              }
            }
            .phone {
              color: @grayColor;
            }
          }
          .addr-detail {
            color: @grayColor;
            margin-top: 16px;
            letter-spacing: 1px;
          }
        }
        .addr-handler {
          height: 70px;
          #flexStyle(space-between, center);
          padding: 0 26px;
          width: 100%;
          box-sizing: border-box;
          .set-default {
            #flexStyle();
            .checkbox {
              width: 30px;
              height: 30px;
              margin-right: 14px;
              .iconfont {
                font-size: 30px;
                color: @defaultColor
              }
            }
          }
          .right-edit {
            #flexStyle('', center);
            .edit-item {
              #flexStyle('', center);
              margin-left: 20px;
              line-height: @largeFont;
              .iconfont {
                font-size: @largeFont;
                color: @defaultColor;
                margin-right: 4px;
              }
            }
          }
        }
      }
    }
    .add-addr-btn {
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
</style>
