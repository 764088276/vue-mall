import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'

//删除地址
export default function delAddr(addrId){
  let param = [
    ['cid', cid],
    ['userid', userid],
    ['addids', addrId]
  ];
  return getFromPhpData(param, "delAddress");
}
