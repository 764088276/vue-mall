import {getFromPhpData} from "../../utils/tool/getData";
import {cid} from '../../utils/constData'

//获取商品规格
export default function getGoodType(goodId){
  let param=[
    ['goods_id',goodId],
    ['cid',cid]
  ];
  return getFromPhpData(param,'getGoodSpecification')
}
