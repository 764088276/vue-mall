<template>
  <div class="search-bar">
    <back @back="_back" v-if="isShowBack"></back>
    <div class="input-container">
      <input
        type="text"
        :placeholder="placeholder"
        v-model="inputValue"
        @input="_input"
        @keyup.enter="_search"
      >
      <span class="delete"
            :class="{active:inputValue}"
            @click="_clearKeyword"
      >&times;</span>
    </div>
    <div class="search-btn" @click="_search">
      <span>搜索</span>
    </div>
  </div>
</template>

<script>
  import back from '../../components/tip/back/back'

  export default {
    name: "search-bar",
    data() {
      return {
        inputValue: this.keyword,
        isShowBack:this.showBack
      }
    },
    props: {
      keyword: {
        type: String,
        default: ''
      },
      showBack:{
        type:Boolean,
        default:true
      },
      placeholder:{
        type:String,
        default:'请输入搜索关键词'
      }
    },
    components: {
      back
    },
    created(){
      this._isNeedBack();
    },
    methods: {
      _search() {
        this.$emit('search', this.inputValue)
      },
      _input() {
        if (!this.inputValue) {
          this.$emit('inputEmpty');
        }
      },
      _isNeedBack(){
        if(history.length<=2){
          this.isShowBack=false;
        }
      },
      _back(){
        this.$router.back();
      },
      _clearKeyword() {
        this.inputValue = '';
        this.$emit('inputEmpty');
      },
      setKeyword(word) {
        this.inputValue = word;
        this._search();
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .search-bar {
    height: 106px;
    #flexStyle(center, center);

    .input-container {
      flex: 1;
      height: 58px;
      border-radius: 29px;
      #flexStyle(center, center);
      padding: 0 60px 0 40px;
      box-sizing: border-box;
      background: @lightGrayColor;
      margin-left: 10px;
      position: relative;

      input {
        width: 100%;
        outline: 0 none;
        background: transparent;
        border: 0 none;
        font-size: @middleFont;
      }
      .delete {
        font-size: 44px;
        line-height: 30px;
        display: block;
        position: absolute;
        right: 20px;
        top: 44%;
        transform: translateY(-50%);
        color: @grayColor;
        opacity: 0;
        transition: all 0.3s;
        z-index: 10;

        &.active {
          opacity: 1;
        }
      }
    }
    .search-btn {
      width: 100px;
      text-align: center;
      font-size: @middleFont;
    }
  }
</style>
