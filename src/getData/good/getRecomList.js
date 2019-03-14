//获取相关推荐商品
import {getFromPhpData} from "../../utils/tool/getData";
import {userid,cid} from '../../utils/constData'

export default function getRecomGood() {
  let param=[
    ['cid',cid],
    ['user_id',userid]
  ];
  return getFromPhpData(param,'goodslist')
}
