//获取分类列表
import {getFromPhpData,getMachineLoveData} from "../../utils/tool/getData";
import {cid} from '../../utils/constData'

//获取一级分类
export function getFirstSort(){
  let param=[
    ['customer_id',cid]
  ];
  return getMachineLoveData(param,'getFirstProductCatelog')
}

//  获取次级分类目录(参数分类id)（可以获取二级或三级分类）
export function getSecondSort(cateId) {
  let param = [
    ['customer_id',cid],
    ['cate_id', cateId]
  ];
  return getMachineLoveData(param,'getSecondProductCatelog')
}
