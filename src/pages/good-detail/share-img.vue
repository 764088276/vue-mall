<template>
  <transition name="slide">
    <div class="share-img page-container with-pagetitle">
      <page-title :title="pageTitle"></page-title>
      <div class="page-content" v-show="showContent">
        <canvas class="canvas" ref="canvas" v-show="!canvasImage" :width="canvasWidth" :height="canvasHeight"></canvas>
        <img :src="canvasImage" class="canvas" alt="" v-if="canvasImage">
      </div>
      <loading ref="loading"></loading>
    </div>
  </transition>
</template>

<script>
  import pageTitle from '../../components/item/page-title'
  import loading from '../../components/tip/loading/loading'

  import storage from '../../utils/tool/storage'
  import {userInfo, userid} from '../../utils/constData'

  import createCode from '../../getData/code/getCode'

  export default {
    name: "share-img",
    components: {
      pageTitle,
      loading
    },
    data() {
      return {
        showContent:false,
        canvasWidth:650,
        canvasHeight:934,
        goodDetail: null,
        pageTitle: '',
        codeUrl: '',
        avatarUrl: userInfo.avatar,
        nickname: userInfo.nickname,
        //绘制需要的三个图片对象
        goodImage: '',
        codeImage: '',
        avatarImage: '',
        //canvas转化出来的image
        canvasImage:''
      }
    },
    mounted() {
      this._initComponent();
      this._initPage();
    },
    methods: {
      _initPage() {
        this._getGoodDetail();
        this._getCode();
      },
      _initComponent() {
        this.loading=this.$refs.loading;
      },
      _getGoodDetail() {
        this.goodDetail = storage.getItem('goodDetail');
        this.pageTitle = `${this.goodDetail.name}的分享图片`
      },
      async _getCode() {
        let {goodDetail} = this;
        let codeData = {
          width: 300,
          path: 'pages/good-detail/good-detail',
          query: `id_${goodDetail.id}/uid_${userid}`
        };
        this.loading.showLoading();
        let resData = await createCode(codeData);
        this.codeUrl = resData.data;
        this._loadImg().then(() => {
          this._drawCanvas();
          this.loading.hideLoading();
          this.showContent=true;
        })
      },
      //将全部需要的图片加载完成
      _loadImg() {
        let {codeUrl, goodDetail, avatarUrl} = this;
        return new Promise((resolve => {
          Promise.all([
            this._loadSingleImage(codeUrl, 'codeImage'),
            this._loadSingleImage(goodDetail.coverImg, 'goodImage'),
            this._loadSingleImage(avatarUrl, 'avatarImage')
          ]).then(() => {
            resolve()
          })
        }))
      },
      //加载单张图片
      _loadSingleImage(imgUrl, imageName) {
        let image = new Image();
        image.src = imgUrl+'?timeStamp='+new Date();
        image.crossOrigin='Anonymous';
        return new Promise(resolve => {
          image.onload = () => {
            this[imageName] = image
            resolve();
          }
        })
      },
      _drawCanvas() {
        let {canvasWidth,goodDetail, goodImage, codeImage, avatarImage, nickname} = this;
        let canvas=this.$refs.canvas;
        let ct=canvas.getContext('2d');
        // canvas的部分全局变量
        let canvasPadding = 20;
        let avatarRadius =  35;
        let avatarMarginRight =  14;
        let titleTextFont =  30;
        let nickNameColor = '#00c800';
        let nickNameMaxLen =  120;
        let headerText ="分享给你一个商品";
        let commonTextColor = '#343434';
        let coverImgMargin =  20;
        let coverImgWidth =  canvasWidth-2*canvasPadding;
        let goodNameFont =  30;
        let goodNameColor = '#000000';
        let goodNameLineMargin=4;
        let goodNameMargin =  10;
        let codeWidth =  124;
        let priceColor = '#00c800';
        let smallFont =  26;
        let smallTextColor = '#a9a9a9';
        let priceFont =  46;
        let bottomText='长按保存图片,微信扫码打开';
        let bottomTextMargin=10;
        //计算canvas的总高
        let canvasBaseHeight=canvasPadding*2+avatarRadius*2+coverImgMargin*2+coverImgWidth+goodNameMargin+codeWidth;
        ct.font=goodNameFont+'px Arial';
        let goodNameArr=this._cutTextToArr(ct,goodDetail.name,coverImgWidth);
        for(let i=0,len=goodNameArr.length;i<len;i++){
          canvasBaseHeight+=(goodNameLineMargin+goodNameFont)
        }
        canvas.height=canvasBaseHeight;

        //绘制白色背景
        ct.fillStyle='#ffffff';
        ct.fillRect(0,0,canvasWidth,canvasBaseHeight);
        ct.translate(canvasPadding,canvasPadding);
        //draw avatar
        ct.save();
        ct.arc(avatarRadius,avatarRadius,avatarRadius,0,Math.PI*2);
        ct.clip();
        ct.drawImage(avatarImage,0,0,avatarRadius*2,avatarRadius*2)
        ct.restore();
        ct.save();

        //draw header text
        ct.translate(avatarRadius*2+avatarMarginRight,avatarRadius);
        ct.textBaseline='middle';
        ct.font=titleTextFont+'px Arial';
        ct.fillStyle=nickNameColor;
        ct.fillText(this._cutNickName(ct,nickname,nickNameMaxLen),0,0);
        ct.translate(nickNameMaxLen+20,0);
        ct.fillStyle=commonTextColor;
        ct.fillText(headerText,0,0);
        ct.restore();

        ct.save();
        //draw goodImage
        ct.translate(0,avatarRadius*2+coverImgMargin);
        this._drawGoodImage(ct,goodImage,coverImgWidth);

        //draw goodname text
        ct.translate(0,coverImgWidth+coverImgMargin);
        ct.font=goodNameFont+'px Arial';
        ct.textBaseline='top';
        ct.fillStyle=goodNameColor;
        for(let i=0,len=goodNameArr.length;i<len;i++){
          ct.fillText(goodNameArr[i],0,0);
          ct.translate(0,goodNameFont+goodNameLineMargin);
        }
        //draw code and price in the bottom of canvas
        ct.translate(0,goodNameMargin);
        ct.drawImage(codeImage,coverImgWidth-codeWidth,0,codeWidth,codeWidth);
        ct.translate(0,codeWidth/2);
        this._drawCanvasText(ct,'￥',priceColor,smallFont,0,0,'bottom');
        this._drawCanvasText(ct,goodDetail.sellPrice,priceColor,priceFont,smallFont,4,'bottom');
        this._drawCanvasText(ct,bottomText,smallTextColor,smallFont,0,bottomTextMargin,'top')
        this.canvasImage=canvas.toDataURL();
      },
      //绘制文本
      _drawCanvasText(ct,text,color,fontSize,x,y,baseLine='top'){
        ct.fillStyle=color;
        ct.textBaseline=baseLine;
        ct.font=fontSize+'px Arial';
        ct.fillText(text,x,y);
      },
      //根据coverImg的大小给goodImage放置在制定的位置
      _drawGoodImage(ct,goodImage,imageWidth){
        let {width,height}=goodImage;
        let [_width,_height]=['',''];
        if(width>=height){
          _width=imageWidth;
          _height=_width*height/width;
        }else{
          _height=imageWidth;
          _width=width*_height/height;
        }
        ct.drawImage(goodImage,(imageWidth-_width)/2,(imageWidth-_height)/2,_width,_height);
      },
      //将文本裁剪成包含多段的文本Arr
      _cutTextToArr(ct,text,maxLen){
        let textArr=text.split('');
        let resultArr=[];
        let _text='';
        for(let i=0,len=textArr.length;i<len;i++){
          let curText=_text+textArr[i];
          let addedWidth=ct.measureText(curText).width;
          if(addedWidth>maxLen){
            resultArr.push(_text);
            _text='';
            continue;
          }
          if(i==len-1){
            resultArr.push(curText);
            continue
          }
          _text=curText;
        }
        return resultArr
      },
      //将超出最大长度的nickname进行裁剪
      _cutNickName(ct,text,maxWidth){
        let textWidth=ct.measureText(text).width;
        if(textWidth<=maxWidth){
          return text
        }
        let textArr=text.split('');
        let result='';
        for(let i =0;i<textArr.length;i++){
          let _result=''+result+textArr[i];
          let width=ct.measureText(_result).width;
          if(width>=maxWidth){
            break
          }
          result=_result;
        }
        return result+'...'
      }

    },
    watch:{
      $route(to,from){
        if(to.name.includes('share-img')){
          this.showContent=false;
          this._initPage();
        }
      }
    }
  }
</script>

<style scoped lang='less' rel='stylesheet/less'>
  @import '../../assets/less/common.less';

  .share-img {
    overflow: hidden;
  }

  .page-content {
    width: 100%;
    height: 100%;
    position:relative;
    .canvas {
      box-shadow: 0 0 50px 4px @lightGrayColor;
      position:absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
    }
  }
</style>
