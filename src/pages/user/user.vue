<template>
  <div class="user">
    <div class="info-block">
      <div class="info-container">
        <img :src="userInfo.avatar" class="avatar" alt="">
        <section class="nickname">
          <span>{{userInfo.nickname}}</span>
        </section>
        <section class="user-id">
          <span>ID:{{cid}}{{userid}}</span>
        </section>
      </div>
    </div>
    <ul class="nav-list">
      <li
        class="nav-item"
        v-for="(nav,index) in navList"
        :key="index"
        @click="toNavLink(nav.link)"
      >
        <span class="left-text">
          <span class="iconfont" :class="nav.iconfont"></span>
          <span class="item-name">{{nav.name}}</span>
        </span>
        <span class="iconfont icon-back"></span>
      </li>
    </ul>
  </div>
</template>

<script>
  import {userInfo,cid,userid} from '../../utils/constData'
  export default {
    name: "user",
    components: {},
    data() {
      return {
        navList: [
          {
            name: '我的订单',
            link: 'order-list',
            iconfont: 'icon-order'
          },
          {
            name: '地址管理',
            link: 'addr-list',
            iconfont: 'icon-addr'
          }
        ],
        userInfo,cid,userid
      }
    },
    methods:{
      toNavLink(path){
        this.$router.push({
          name:path
        })
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';
  .user{
    background: #fff;
    padding:20px;
    box-sizing:border-box;
    width:100%;
    height: 100%;

    .info-block{
      border-radius:10px;
      background: @defaultColor;
      width:100%;
      padding:20px 0;
      #flexStyle(center);
      .info-container{
        width:300px;
        color:#fff;
        font-size:30px;
        #flexStyle(center);
        flex-wrap:wrap;
        .avatar{
          width:120px;
          height:120px;
          border-radius:50%;
          display: block;
        }
        .nickname{
          width:100%;
          text-align: center;
          margin:6px 0;
        }
      }
    }
    .nav-list{
      width:100%;
      margin-top:30px;
      .nav-item{
        width:100%;
        #flexStyle(space-between,center);
        font-size:32px;
        line-height: 70px;

        .item-name{
          margin-left:10px;
        }
        .iconfont{
          font-size:32px;
          color: @defaultColor;
        }
        .icon-back{
          display: block;
          transform: rotate(180deg);
        }
      }
    }
  }
</style>
