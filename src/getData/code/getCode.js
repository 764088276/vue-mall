import {getTestApiData} from '../../utils/tool/getData'
import {cid} from '../../utils/constData'

//创建二维码
export default function createCode({path,width=200,query}){
  let data = {
    'customer_id': cid,
    'method':'getWxappQRCode',
    'type': 1,
    'pages': path,
    'width':width,
    'params': query
  };
  return getTestApiData(data)
}
