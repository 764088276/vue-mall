import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from "../../utils/constData";

// 获取搜索结果
export default function getSearchResult(_data) {
  let param = [
    ['cid', cid],
    ['userid',userid||''],
    ['type', _data.searchType||1],
    ['page', _data.page||1],
    ['cate_name', _data.cateName||''],
    ['page_size', _data.pageSize||10],
    ['sql_cache', _data.isUseCache ? '' : 'sql_no_cache']
  ];
  return getFromPhpData(param, 'selLikeGoodsFy');
}
