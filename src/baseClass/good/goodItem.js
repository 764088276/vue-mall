import formateImg from '../../utils/tool/formateImg'
import * as constData from '../../utils/constData'

export default class GoodItem {
  constructor(item) {
    this.name = item.name||item.goods_name;
    this.id = item.goods_id || item.id;
    this.limitPrice = item.goods_limit_price;
    this.sellPrice =formateSellPrice(item);
    this.marketPrice = item.market_price;
    this.listShowPrice=formatePrice(item);
    this.coverImg = formateImg(item.img);
    this.detailImgs = formatImgs(item.imgs);
    this.bannerImgs = formatImgs(item.img);
    this.headImgs = formateHeadImg(item);
    this.currencySymbol = item.currency_symbol||'￥';
    this.currencyRate = formateCurrencyRate(item.currency_rate);
    //将sellPrice转化为对应的rmb
    this.currencySellPrice = formateCurrencySellPrice(item.currency_rate, formateSellPrice(item));
    // this.saleNums = formatSaleNums(item.sales_num, item.id, item.sell_price);
    this.saleNums = item.sales_num;
    this.storage = formateStorage(item);
    this.limitStorage = item.goods_limit_stock;
    this.originSales = item.sales_num;
    this.brand = item.pinpai;
    this.weight = item.weight;
    this.country = item.country_name;
    this.numLimit = getNumLimit(item);
    //是否允许加入购物车
    this.isAllowShopCart = isAllowCart(item);
    //下单时是否需要填写地址
    this.isNeedAddress=item.is_need_address=='N'?false:true;
    this.percent = getPercent(item);
    this.isShowPrice = item.is_show_price=='N'?false:true;
    this.isShowName = item.is_show_name == 'N' ? false : true;
    this.isLimitGood = checkIsLimit(item);
    // this.videoCoverImg = getCoverImg(item.video_cover)
    // 判断商品是否为跨境商品
    this.isCross=item.is_cross==0?false:true;
    // 判断商品是否上架
    this.isOnline = item.is_online=='0'?false:true;
    //判断商品是否有规格参数
    this.isHasColorSize = item.is_color_size_mapping=='N'?false:true;
    // 是否开团的参数
    this.tuanMsg = {
      tuanNums: item.tuan_num,
      tuanPrice: parseFloat(item.tuan_price).toFixed(2),
      isTuan: item.is_tuan,
      reduceCost: calTuanCost(item),
      maxNum: parseInt(item.tuan_max_num)
    }
  }
}

//进行货币转化
function formateCurrencySellPrice(rate,price){
  let _rate=parseFloat(formateCurrencyRate(rate));
  let _price=parseFloat(price);
  return (_rate*_price).toFixed(2)
}
//将货币汇率进行转换
function formateCurrencyRate(rate){
  if(!rate){
    return 1
  }
  let _rate=parseFloat(rate);
  return _rate/100
}

// 是否允许加入购物车
function isAllowCart(item){
  let isLimitGood = checkIsLimit(item);
  let isTuan=item.is_tuan;
  let isAllowShopCart = item.is_allow_shopping_cart == "N" ? false : true;
  let isNeedAddress = item.is_need_address=='N'?false:true
  if (!isLimitGood && isAllowShopCart && isNeedAddress && !isTuan){
    return true
  }
  return false
}

//判断商品是否是限时抢购商品
function checkIsLimit(item) {
  let startTime = +new Date(item.initial_time || 0);
  let finishTime = +new Date(item.finish_time || 0);
  let date = +new Date();
  if (date > startTime && date <= finishTime && item.goods_limit_stock>0) {
    return true
  } else{
    return false
  }
}
// 判断是显示原价还是秒杀价
function formateSellPrice(item) {
  let isShowLimitPrice=(item.is_color_size_mapping=='N'&&item.goods_limit_price&&checkIsLimit(item));
  if (isShowLimitPrice) {
    return item.goods_limit_price
  } else{
    return item.sell_price
  }
}
//为价格添加千分位
function formatePrice(item){
  let price=formateSellPrice(item).toString();
  let intPrice=price.split('.')[0];
  let floatPrice = price.split('.')[1]||'';
  let intPriceArr=intPrice.split('').reverse();
  let _priceText='';
  let _priceArr=[];
  for (let i = 0; i < intPriceArr.length;i++){
    if (_priceText.length>=3){
      _priceText='';
      _priceArr.push(',');
    }
    let txt = intPriceArr[i]
    _priceText += txt ;
    _priceArr.push(txt);
  }
  let result = _priceArr.reverse().join('');
  if (floatPrice){
    result=result+'.'+floatPrice;
  }
  return result
}
// 判断是显示秒杀库存还是正常库存
function formateStorage(item){
  if (checkIsLimit(item)) {
    return item.goods_limit_stock
  } else {
    return item.store_nums
  }
}

//格式化显示的头像
function formateHeadImg(item){
  if(!item.headImgs){
    return []
  }
  let headImgs=item.headImgs.split(',');
  if (item.sales_num<6){
    headImgs=headImgs.slice(0, item.sales_num);
  }
  return headImgs
}

// 计算拼团价格与原价的差异
function calTuanCost(item) {
  if (item.is_tuan == 0) {
    return 0
  }
  let sellPrice = parseFloat(item.sell_price);
  let tuanPrice = parseFloat(item.tuan_price);
  let deltaPrice = (sellPrice - tuanPrice).toFixed(2);
  return deltaPrice
}
//判断剩余库存数占总数的百分比
function getPercent(item) {
  let saleNums = parseInt(item.sales_num);
  let storage = parseInt(item.store_nums);
  let percent = storage / (saleNums + storage) * 100;
  return percent
}
// 进行购买数量限制
function getNumLimit(good) {
  let tsPrice = good.ts_price;
  let isCross=good.is_cross==1?true:false;
  let sellPrice = good.sell_price;
  let isShowLimitPrice = (good.is_color_size_mapping == 'N' && good.goods_limit_price);
  if(isShowLimitPrice){
    return 1
  }
  if (!isCross){
    return ''
  }
  if (!tsPrice) {
    return 999
  }
  return Math.floor(tsPrice / sellPrice)
}
// 格式化购买人数
function formatSaleNums(nums, id, sellPrice) {
  let baseNum = parseInt(id) * sellPrice * 0.01;
  let feakNums = parseInt(nums * baseNum || baseNum) + '';
  if (feakNums >= 10000) {
    return feakNums.substring(0, 1) + '.' + feakNums.substring(1, 2) + '万'
  }
  if (parseInt(feakNums)<7){
    feakNums=7
  }
  return feakNums
}



// 对商品banner和详情图进行处理
function formatImgs(img) {
  if (!img||!img.length){
    return []
  }
  let resultImgs = [];
  let _img=img;
  if (typeof _img =='string'){
    _img=img.split(',');
  }
  normalizeImgs(_img).forEach((item) => {
    if(item){
      resultImgs.push(constData.imgFix + item);
    }
  })
  return resultImgs
}
// 对多图进行排序
function normalizeImgs(imgs) {
  let arr = [];
  if (!imgs || !imgs.length) {
    return []
  }
  imgs.sort(function(a, b) {
    let aName = a.split('.')[0];
    let bName = b.split('.')[0];
    let length = aName.length;
    let aEnd = parseInt(aName.slice(length - 2));
    let bEnd = parseInt(bName.slice(length - 2));
    return aEnd - bEnd
  });
  return imgs
}
