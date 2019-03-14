import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'

//加入购物车
export default function addToCart(_data){
  let param = [
    ['good_id', _data.id],
    ['cid', cid],
    ['good_color', _data.color||''],
    ['good_size', _data.size||''],
    ['goods_amount', _data.num],
    ['user_id',userid]
  ];
  return getFromPhpData(param,'addShopCard')
}
