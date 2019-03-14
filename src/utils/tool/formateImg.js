import {imgFix} from '../constData'

export default function formateImg(img){
  if(!img) {
    return ''
  }
  let _img=img;
  if(img instanceof Array){
    _img=img[0];
  }
  if(_img.startsWith('http')){
    return _img
  }
  return imgFix+_img
}
