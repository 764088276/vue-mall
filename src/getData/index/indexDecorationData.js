import {getFromPhpData} from '../../utils/tool/getData'
import * as constData from '../../utils/constData'

//请求首页的数据
export default function getIndexLocation(_data={}){
  let param = [
    ['app_id', constData.appid||''],
    ['active_name',_data.activeName||'all'],
    ['sub_id',_data.subId||''],
    ['page_type',_data.pageType||'index'],
    ['page_desc',_data.title||'']
  ];
  return getFromPhpData(param,'getIndexLocation')
}

