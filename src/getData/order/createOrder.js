import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'
import formateStr from '../../utils/tool/formateStr'
//创建订单
export default function createOrder(_data){
  let param = [
    ['address_id', _data.addressId],
    ['receive_address', _data.address],
    ['receive_name', _data.receiverName],
    ['is_need_address','Y'],
    ['cid',cid],
    ['uid', userid],
    ['goodsdateil', formateStr(JSON.stringify(_data.orderMsg))],
    ['app_type', 1]
  ];
  return getFromPhpData(param, 'saveReceiveAddress');
}
