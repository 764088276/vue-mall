//获取购物车商品详情
import {getFromPhpData} from "../../utils/tool/getData";
import {cid,userid} from '../../utils/constData'
import CartItem from '../../baseClass/good/cartItem'

export default function getShopCartGood(){
  let param=[
    ['cid',cid],
    ['user_id',userid]
  ];
  return getFromPhpData(param,'getCardList')
}

//将获取的购物车数据格式化
export function formateShopCartGood(){
  return new Promise(resolve=>{
    getShopCartGood().then(res=>{
      let shopCartList=[];
      if(res.data.code==200){
        let resData=res.data.data[0];
        if(resData){
          resData.getShopping.forEach(item=>{
            shopCartList.push(new CartItem(item));
          })
        }
      }
      resolve(shopCartList);
    })
  });

}
