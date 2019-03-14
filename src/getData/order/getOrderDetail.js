import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'
//获取订单详情
export default function getOrderDetail(orderId){
  let param = [
    ['cid', cid],
    ['userid', userid],
    ['order_id', orderId]
  ];
  return getFromPhpData(param, 'getOrderList');
}
