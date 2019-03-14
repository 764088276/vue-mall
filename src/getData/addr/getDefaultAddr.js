import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from "../../utils/constData";

//获取用户的默认收货地址
export default function getDefaultAddr(){
  let param = [
    ['cid', cid],
    ['userid',userid]
  ];
  return getFromPhpData(param, 'defind');
}
