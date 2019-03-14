//支付订单对象
export default class PayItem{
  constructor(payItem){
    this.goods_id=payItem.id;
    this.sell_price=payItem.sellPrice;
    this.goods_amount=payItem.goodNum||1;
    this.name=payItem.name;
    this.product_color=payItem.goodColor;
    this.product_size=payItem.goodSize;
    this.coverImg=payItem.coverImg;
    this.isCross=payItem.isCross;
  }
}
