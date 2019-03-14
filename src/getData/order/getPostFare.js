import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'

//获取运费
export default function getPostFare(_data){
  let param=[
    ['customer_id',cid],
    ['province_code', _data.provinceCode],
    ['goods_list',_data.goodsList],
    ['user_id',userid]
  ];
  return getFromPhpData(param,'getGoodsTransportFeeByProvinceCode');
}
