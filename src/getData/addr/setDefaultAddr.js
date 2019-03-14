import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'

//设置默认地址
export default function setDefaultAddr(addrId){
  let param = [
    ['cid', cid],
    ['userid', userid],
    ['addids', addrId]
  ];
  return getFromPhpData(param, "setDefaultAddress");
}
