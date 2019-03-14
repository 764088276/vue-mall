import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'

//获取用户订单列表
export default function getOrderList(_data={}){
  let param = [
    ['cid', cid],
    ['userid',userid],
    ['page', 1],
    ['page_size', 40],
    ['order_status', ''],
    ['key_words', _data.keyword||'']
  ];
  return getFromPhpData(param, 'getuserorderList2Fy');
}
