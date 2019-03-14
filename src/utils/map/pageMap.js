import getLinkQuery from '../tool/getLinkQuery.js'
//对页面数据的映射
export default function pageMap(link) {
  let result = null;
  let query = getLinkQuery(link);
  if (link.indexOf('activities') > -1 && link.indexOf('otherPackage') > -1) {
    result = {
      name: 'sec-page'
    }
  }
  if (result) {
    result.query = query
  }
  return result
}

