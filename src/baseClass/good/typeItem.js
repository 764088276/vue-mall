import formateImg from '../../utils/tool/formateImg'
//商品的规格
export default class TypeItem{
  constructor(type){
    this.color=type.goods_color;
    this.size=type.goods_size;
    this.priceChange=type.price_change||0;
    this.storage=type.store_nums||0;
    this.coverImg=formateImg(type.goods_color_img);
  }
}
