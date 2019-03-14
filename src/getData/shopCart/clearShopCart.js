import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'

export default function clearShopCart(_data){
  let param=[
    ['cid',cid],
    ['user_id',userid],
    ['good_id',_data.goodsId],
    ['goods_color_size_id', _data.goodsColorSizeId],
  ];
  return getFromPhpData(param,'delShopCard')
}
