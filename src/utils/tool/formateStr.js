//去除一些特殊字符
export default function formateStr(str){
  let _str = str;
  _str = _str.replace(/[\+\*【】']/g, " ");
  return _str
}
