import {imgFix} from "../../utils/constData";

export default class SortItem{
  constructor(sort){
    this.name=sort.title;
    this.img=imgFix+sort.thumb;
    this.cateId=sort.id;
    this.isShowTitle = sort.is_show_title=='N'?false:true
  }
}
