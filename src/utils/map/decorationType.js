//对首页自定义装修的每一个版本的类型做处理

export default function formateIndexType(type){
  if(type.indexOf('catelog')>-1){
    return 'catelog'
  }
  if (type.indexOf('poster') > -1) {
    return 'poster'
  }
  if(type.indexOf('brand')>-1){
    return 'brand'
  }
  return ''
}
