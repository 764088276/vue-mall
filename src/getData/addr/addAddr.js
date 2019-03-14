import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'

//新增地址
export default function addAddr(_data={}){
  let param = [
    ['cid', cid],
    ['userid', userid],
    ['receive_address', _data.address],
    ['receive_name', _data.name],
    ['receive_phone', _data.phone],
    ['consignee_province', _data.province],
    ['consignee_city', _data.city],
    ['consignee_district', _data.district],
    ['receive_idnumber',_data.idnumber||''],
    ['addids', _data.id]
  ];
  return getFromPhpData(param,'addUserAddress')
}
