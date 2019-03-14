import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'

// 取消订单
export  function cancelOrder(orderId){
  let newData = [
    ['customer_id', cid],
    ['order_id', orderId]
  ];
  return getFromPhpData(newData, "orderDelete");
}

//确认订单
export function confirmOrder(orderId){
  let newData = [
    ['customer_id',cid],
    ['order_id', orderId]
  ];
  return getFromPhpData(newData, "orderReceiveConfirm");
}
