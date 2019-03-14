import formateImg from '../../utils/tool/formateImg'
import pageMap from '../../utils/map/pageMap'

//首页分类
export class SortItem {
  constructor(sort) {
    this.name = sort.cate_title;
    this.cateId = sort.cate_id;
    this.imgUrl = formateImg(sort.link_url);
    this.isShowTitle = sort.is_show_title == 'N' ? false : true
  }
}


//海报
export class Poster {
  constructor(poster) {
    this.imgUrl = poster.poster_url;
    this.linkUrl = pageMap(poster.link_url || '');
  }
}

//brand
export class Brand {
  constructor(brand) {
    this.brandId = brand.brand_id;
    this.brandName = brand.pinpai;
    this.brandImg = formateImgLink(brand.link_url);
  }
}

function formateLinkUrl(link) {
  if (link.indexOf('/') == 0) {
    return link
  }
  return '/' + link
}

function formateImgLink(imgLink) {
  return encodeURI(imgLink)
}
