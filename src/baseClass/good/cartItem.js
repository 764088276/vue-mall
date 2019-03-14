import GoodItem from './goodItem'

export default class CartItem extends GoodItem{
  constructor(good){
    super(good);
    this.goodColor=good.goods_color||'';
    this.goodSize=good.goods_size||'';
    this.goodColorSizeId=good.goods_color_size_id||'';
    this.goodNum=good.goods_amount||0;
    this.sellPrice=getCartPrice(good);
    //表明购物车中这个商品是否被选中
    this.isChoosed=true;
  }
}
//将原有价格加上价格浮动值
function getCartPrice(good){
  let priceChange=parseFloat(good.price_change||0);
  let sellPrice=parseFloat(good.sell_price);
  return parseFloat((sellPrice+priceChange).toFixed(2))
}
