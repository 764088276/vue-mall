import formatImg from '../../utils/tool/formateImg'

export default class OrderItem {
  constructor(order) {
    this.coverImg = formatImg(order.img);
    this.name = order.goods_name;
    this.price = formatePrice(order.paied_fee);
    this.nums = parseInt(order.goods_amount);
    this.orderId = order.order_id;
    this.payStatus = order.pay_status;
    this.goodColor = order.goods_color;
    this.goodSize = order.goods_size;
    this.colorSizeId = order.goods_color_size_id;
    this.receiveName = order.consignee_name;
    this.receivePhone = order.consignee_mobile;
    this.address = formatAddress(order);
    this.createTime = order.created_date;
    this.paidTime = order.paied_date
    this.orderSn = order.order_sn;
    this.unitPrice = order.unit_price;
    // 订单状态(10001待付款,10090支付中，10002已付款，待发货.10003已发货待收货，10004已收货订单完成，10005订单已评论，10006已取消)
    this.orderStatus = order.order_status;
    // 该订单是否已经支付
    this.isPaied = checkStatus(order);
    this.goodId = order.goods_id;
    this.tuanId = order.tuan_id;
    this.tuanNum = parseInt(order.tuan_num);
    // 商品的运费
    this.postageFare = formatePrice(order.shipping_fee);
    //订单使用的积分
    this.usedPoint = order.paied_by_point;
    //使用积分兑换的金额
    this.usedPointMoney = order.paied_by_point_to_money;
    //订单使用的余额
    this.usedMoney = order.paied_by_account_balance;
    //该商品是否需要填写地址
    this.isNeedAddress = order.is_need_address == 'N' ? false : true
  }
}

// 判断该订单是否已经付款
function checkStatus(order) {
  let status = order.order_status;
  if (status == 10001 || status == 10006) {
    return false
  }
  return true
}

// 计算订单的总价（包含运费）
function calculateCost(order) {
  let price = parseFloat(order.paied_fee);
  let postageFare = parseFloat(order.shipping_fee);
  let allCost = (price + postageFare).toFixed(2);
  return allCost
}

// 计算订单的优惠金额
function calculateFreeCost(order) {
  let price = parseFloat(order.paied_fee);
  let postageFare = parseFloat(order.shipping_fee);

}

function formatAddress(order) {
  // let c = order.consignee_country;
  let p = order.consignee_province;
  let city = order.consignee_city;
  let d = order.consignee_district;
  let detail = order.consignee_address;
  return p + city + d + detail
}

function formatePrice(price) {
  return parseFloat(price).toFixed(2)
}
