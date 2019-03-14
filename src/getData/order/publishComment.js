import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'

// 发布评论
export default function publishComment({orderId,goodId,star,comment,commentImgs=''}){
  let newData = [
    ['customer_id', cid],
    ['user_id',userid],
    ['order_id', orderId],
    ['goods_id',goodId],
    ['star', star],
    ['comment',comment],
    //commentImgs字符串，以双逗号,,分隔
    ['comment_imgs',commentImgs],
  ];
  return getFromPhpData(newData, "addGoodsComment");
}
