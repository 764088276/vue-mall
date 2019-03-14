<template>
  <div class="page-container with-pagetitle comment-order with-bottom-btn">
    <page-title title="发表评价"></page-title>
    <div class="page-content">
      <div class="comment-list">
        <div class="comment-item"
             v-for="(order,index) in commentDetail"
             :key="index"
        >
          <div class="comment-header">
            <img :src="order.coverImg" alt="">
            <span>{{order.name}}</span>
          </div>
          <div class="comment-stars">
            <span>评分</span>
            <div class="stars-container">
              <div
                class="star-item"
                v-for="star in 5"
                :key="star"
                @click="_chooseStar(index,star)"
              >
                <span class="iconfont icon-empty-star" v-show="order.stars<star"></span>
                <span class="iconfont icon-full-star" v-show="order.stars>=star"></span>
              </div>
              <span class="star-text"
                    :class="order.stars>3?'good':(order.stars<3?'bad':'')">{{starText[order.stars-1]}}</span>
            </div>
          </div>
          <div class="comment-content">
            <div class="text-container">
              <textarea
                maxlength="100"
                placeholder="您的评价将会给我们带来极大的帮助~"
                v-model="order.comment"
              ></textarea>
              <span class="all-length">{{order.comment.length}}/100</span>
            </div>
              <div class="img-container">
                <div class="upload-img" v-for="(img,imgIndex) in order.tempImgs" :key="imgIndex">
                  <img :src="img" alt="">
                  <span class="del-icon" @click="_delImg(index,imgIndex)">
                    &times;
                  </span>
                </div>
                <div class="add-img" v-show="order.tempImgs.length<maxImgs">
                  <div class="add-img-container" @click="_chooseImg(index)">
                    <input type="file" style="display: none" ref="fileInput" @change="_putImg($event,index)"
                           multiple="multiple">
                    <span class="iconfont icon-camera"></span>
                    <span class="text">上传图片</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-whole-btn publish-comment">
      <button class="btn" @click="_comment">
        <span>发表评论</span>
      </button>
    </div>
    <loading ref="loading"></loading>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  import pageTitle from '../../components/item/page-title'
  import loading from '../../components/tip/loading/loading'
  import toast from '../../components/tip/toast'

  import getOrderDetail from '../../getData/order/getOrderDetail'
  import uploadFile from '../../getData/upload/uploadFile'
  import publishComment from '../../getData/order/publishComment'

  import OrderItem from '../../baseClass/order/OrderItem'

  import components from '../../mixins/initComponents'

  export default {
    mixins: [components],
    name: "comment-order",
    components: {
      pageTitle,
      loading,
      toast
    },
    data() {
      return {
        orderId: '',
        commentDetail: [],
        fileList: [],
        maxImgs: 6,
        starText: ['很差', '差', '一般', '好', '很好'],
        //表示是否正在发表评论
        isPublishing:false
      }
    },
    mounted() {
      this._initPage();
    },
    methods: {
      _initPage() {
        this._initQuery();
        this._getOrderDetail();
      },
      _initQuery() {
        let {orderId} = this.$route.query;
        this.orderId = orderId;
      },
      async _getOrderDetail() {
        let {orderId} = this;
        this.loading.showLoading();
        let resData = await getOrderDetail(orderId);
        this.loading.hideLoading();
        let commentDetail = [];
        if (resData.data.code == 200) {
          resData.data.data[0].getOrderList.forEach(item => {
            commentDetail.push(Object.assign(new OrderItem(item), {
              comment: '',
              stars: 5,
              tempImgs: [],
              imgs: []
            }));
            this.fileList.push([])
          });
        }
        this.commentDetail = commentDetail;
      },
      _chooseStar(index, star) {
        let {commentDetail} = this;
        let curComment = commentDetail[index];
        curComment.stars = star;
        this.commentDetail = commentDetail;
      },
      //选择图片
      _chooseImg(index) {
        let fileInput = this.$refs.fileInput[index];
        fileInput.click();
      },
      //删除选中的图片
      _delImg(index, imgIndex) {
        let {commentDetail} = this;
        let curComment = commentDetail[index];
        let curImgArr = curComment.tempImgs;
        curImgArr.splice(imgIndex, 1);
        this.commentDetail = commentDetail;
      },
      //将选择的图片放在对应的位置
      _putImg(e, index) {
        let curFileInput = this.$refs.fileInput[index];
        let chooseFiles = curFileInput.files;
        let {commentDetail, maxImgs, fileList} = this;
        let curFileList = fileList[index];
        for (let i = 0, l = chooseFiles.length; i < l; i++) {
          let curFile = chooseFiles[i];
          if (!this._validateImage(curFile)) {
            continue
          }
          let fileReader = new FileReader();
          fileReader.onload = (file) => {
            let {tempImgs} = commentDetail[index];
            if (tempImgs.length >= maxImgs) {
              return
            }
            curFileList.push(curFile);
            let tempFile = file.target.result;
            tempImgs.push(tempFile);
            this.commentDetail = commentDetail;
            this.$set(this.fileList, index, curFileList);
          };
          fileReader.readAsDataURL(curFile);
        }
      },
      //判断用户上传图片是否符合要求
      _validateImage(file) {
        let {type, size} = file;
        //最大上传大小
        let maxSize = 3 * 1024 * 1024;
        let typeArr = ['image/png', 'image/jpg', 'image/jpeg'];
        if (size > maxSize) {
          return false
        }
        if (typeArr.indexOf(type) === -1) {
          return false
        }
        return true
      },
      //初始化图片数组
      _initImgsArr(){
        let {commentDetail}=this;
        commentDetail.forEach(item=>{
          item.imgs=[]
        })
        this.commentDetail=commentDetail;
      },
      //每个form上传团片
      async _uploadImgs(index,imgList) {
        let {commentDetail}=this;
        for (let i = 0, l = imgList.length; i < l; i++) {
          let curImg = imgList[i];
          let res = await uploadFile(curImg);
          commentDetail[index].imgs.push(res.data);
        }
        this.commentDetail=commentDetail;
      },
      async _uploadAllImgs(){
        let {fileList} = this;
        for (let i = 0, l = fileList.length; i < l; i++) {
          let curFileList = fileList[i];
          await this._uploadImgs(i,curFileList);
        }
      },
      async _publishComment(){
        await this._uploadAllImgs();
        let {commentDetail}=this;
        for(let i=0,l=commentDetail.length;i<l;i++){
          let curComment=commentDetail[i];
          let commentData={
            orderId:curComment.orderId,
            goodId:curComment.goodId,
            comment:curComment.comment,
            star:curComment.stars,
            commentImgs:curComment.imgs.join(',')
          };
          await publishComment(commentData)
        }
      },
      //发表评论
      _comment() {
        let {isPublishing}=this;
        if(isPublishing){
          return
        }
        this._initImgsArr();
        this.isPublishing=true;
        this.loading.showLoading();
        this._publishComment().then(()=>{
          this.loading.hideLoading();
          this.isPublishing=false;
          this.toast.showToast({
            text:'发表评论成功!'
          });
          setTimeout(()=>{
            this.$router.back()
          },1500)
        })
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  #paddingStyle {
    padding: 20px;
    box-sizing: border-box;
  }

  #borderStyle {
    border-bottom: 1px solid #ccc;
  }

  .comment-order {
    background: @bgColor;
    .page-content {
      .comment-list {
        .comment-item {
          background: #fff;
          margin-bottom: 10px;

          .comment-header {
            #borderStyle();
            #paddingStyle();
            #flexStyle('', center);

            > img {
              width: 60px;
              height: 60px;
              margin-right: 20px;
            }
          }
          .comment-stars {
            #flexStyle('', center);
            #paddingStyle();
            font-size: @largeFont;
            #borderStyle();

            .stars-container {
              margin-left: 20px;
              #flexStyle();
              .iconfont {
                font-size: 40px;
                color: @defaultColor;
                display: block;
              }
              .star-item {
                display: flex;
                margin: 0 4px;
              }
              .star-text {
                margin-left: 20px;
                &.bad {
                  color: red
                }
                &.good {
                  color: @defaultColor
                }
              }
            }

          }
          .comment-content {
            #paddingStyle();
            .text-container {
              width: 100%;
              position: relative;
              height: 200px;

              textarea {
                width: 100%;
                height: 100%;
                color: #333;
                resize: none;
              }
              .all-length {
                position: absolute;
                bottom: 0;
                right: 0;
                color: #999;
              }
            }
          }
          .img-container {
            width: 100%;
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            .upload-img {
              width: 160px;
              display: flex;
              height: 160px;
              #flexStyle(center, center);
              border: 1px dashed #666;
              margin: 0 15px 10px 0;
              position: relative;
              > img {
                width: 100%;
              }
              .del-icon {
                position: absolute;
                top: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.6);
                font-size: 40px;
                color: #fff;
                width: 40px;
                height: 40px;
                text-align: center;
                line-height: 40px;
              }
            }
            .add-img {
              width: 160px;
              height: 160px;
              border: 1px dashed #666;
              color: #666;
              #flexStyle(center, center);
              .add-img-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
              }
              .iconfont {
                font-size: 40px;
              }
              .text {
                margin-top: 10px;
              }

            }
          }
        }
      }
    }
    .publish-comment {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
</style>
