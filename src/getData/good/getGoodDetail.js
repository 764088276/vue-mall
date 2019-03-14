import {getFromPhpData} from "../../utils/tool/getData";
import {cid} from '../../utils/constData'

export default function getGoodDetail(goodId,store_id,machine_alias){
  let param = [
    ['id', goodId],
    ['cid', cid],
    ['sql_cache','sql_no_cache'],
    ['store_id', store_id||''],
    ['machine_alias', machine_alias||'']
  ];
  return getFromPhpData(param,'getGoodsDetail')
}
