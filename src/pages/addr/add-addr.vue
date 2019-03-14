<template>
  <transition name="slide">
    <div class="add-addr page-container with-pagetitle">
      <page-title title="新增地址"></page-title>
      <form class="add-addr-form" @submit.prevent="_submitForm">
        <div class="input-list">
          <div class="input-container name">
            <input type="text" name="name" placeholder="收货人姓名" v-model="name">
          </div>
        </div>
        <div class="input-list">
          <div class="input-container phone">
            <input type="number" name="phone" placeholder="手机号码" v-model="phone">
          </div>
        </div>
        <div class="input-list" @click="_showPicker">
          <div class="input-container city">
            <span v-if="!cityData">请选择省市区</span>
            <span v-if="cityData">{{_city}}</span>
          </div>
        </div>
        <div class="input-list">
          <div class="input-container detail">
            <input type="text" name="detail" placeholder="请填写详细地址" v-model="detail">
            <!--<span class="iconfont icon-addr"></span>-->
          </div>
        </div>
        <div class="input-list">
          <div class="input-container idno">
            <input type="text" name="idno" placeholder="收货人身份证号码(选填)" v-model="idNo">
          </div>
        </div>
        <div class="bottom-whole-btn submit-btn">
          <input class="btn" type="submit" value="添加地址">
        </div>
      </form>
      <toast ref="toast"></toast>
      <city-picker v-model="isShowPicker" @on-finish="_selectCity"></city-picker>
    </div>
  </transition>
</template>

<script>
  import pageTitle from '../../components/item/page-title'
  import cityPicker from 'vue-citypicker'
  import toast from '../../components/tip/toast'

  import addAddr from '../../getData/addr/addAddr'

  export default {
    name: "add-addr",
    data() {
      return {
        isShowPicker: false,
        cityData:null,
        name:'',
        phone:'',
        idNo:'',
        detail:''
      }
    },
    created(){
    },
    computed:{
      _city(){
        let {cityData}=this;
        return `${cityData.province.name} ${cityData.city.name} ${cityData.area.name}`
      }
    },
    mounted(){
      this._initComponents();
      this._initAddr();
    },
    methods: {
      _showPicker() {
        this.isShowPicker = true;
      },
      _selectCity(val){
        this.cityData=Object.assign({},val);
      },
      _initAddr(){
        let addrMsg=this.$route.query.addrMsg;
        let obj={};
        //如果存在addrMsg，则进行初始设置，无则重置
        if(addrMsg){
          let addrInfo=JSON.parse(addrMsg);
          obj={
            cityData:{
              province:{name:addrInfo.province},
              city:{name:addrInfo.city},
              area:{name:addrInfo.area}
            },
            name:addrInfo.receiverName,
            phone:addrInfo.phone,
            detail:addrInfo.detail,
            idNo:addrInfo.idNumber
          };
        }else{
          obj={
            cityData:null,
            name:'',
            phone:'',
            detail:'',
            idNo:''
          }
        }
        Object.assign(this,obj);
      },
      _initComponents(){
        this.toast=this.$refs.toast;
      },
      _submitForm(){
        let {name,phone,idNo,detail,cityData}=this;
        if(name.trim().length<3){
          this.toast.showToast({
            text:'请填写收货人姓名~'
          });
          return
        }
        if(!(/^1[345789][0-9]{9}$/).test(phone.trim())){
          this.toast.showToast({
            text:'联系方式出错了~'
          });
          return
        }
        if(!cityData){
          this.toast.showToast({
            text:'请选择所在城市~'
          });
          return
        }
        if(detail.trim().length<3){
          this.toast.showToast({
            text:'详细地址信息出错了~'
          });
          return
        }
        //只有当填写了身份证信息才进行验证
        if(idNo.trim()&&!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(idNo.trim())){
          this.toast.showToast({
            text:'请填写正确的身份证信息~'
          });
          return
        }
        let param={
          name,
          phone,
          province:cityData.province.name,
          city:cityData.city.name,
          district:cityData.area.name,
          idnumber:idNo||'',
          address:detail,
          id:0
        };
        addAddr(param).then(res=>{
          if(res.data.code==200){
            this.toast.showToast({
              text:'保存地址成功！'
            });
            setTimeout(()=>{
              this.$router.back()
            },1500)
          }
        })
      }
    },
    watch:{
      $route(to,from){
        if(to.name=='add-addr'){
          this._initAddr();
        }
      }
    },
    components: {
      pageTitle,
      cityPicker,
      toast
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .add-addr-form {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background: @middleGray;
    .input-list {
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;

      .input-container {
        height: 90px;
        #flexStyle('', center);
        border-bottom: 1px solid @grayColor;
        position: relative;
        padding-right: 40px;
        box-sizing: border-box;
        font-size: @middleFont;
        color: #757575;
        > input {
          line-height: @middleFont;
          border: 0 none;
          outline: 0 none;
          width: 100%;
          background: transparent;
          font-size: @middleFont;
          color: #333;

        }
        .iconfont {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          display: block;
          z-index: 100;
          font-size: @largeFont;
          color: @defaultColor;
        }
      }
    }
    .submit-btn {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }


  .add-addr .city-picker-container /deep/ .wrapper {
      font-size: @middleFont;
      .head {
        flex: 0 0 60px;
        height: 60px;
        line-height: 60px;
      }
      .con {
        .tab {
          height: 60px;
          line-height: 60px;
          span {
            line-height: 60px;
          }
        }
        .tab-con {
          padding-top: 60px;
        }
        .province,.city,.area{
          span{
            line-height: 60px;
          }
        }
      }
    }


</style>
