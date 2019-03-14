import {getMachineLoveData} from '../../utils/tool/getData'
import {cid} from '../../utils/constData';

//请求首页banner的数据
export default function getBannerData(){
  let data = [
    ['customer_id', cid],
    ['banner_type', 'index']
  ];
  return getMachineLoveData(data,'getBannerList')
}



