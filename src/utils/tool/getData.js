import axios from 'axios'

const md5 = require('md5');

class GetDataApi {
  constructor({url, data, method = '', isNeedSign = true}) {
    this.url = url;
    this.data = data;
    this.method = method;
    this.isNeedSign = isNeedSign;
  }

  getData() {
    let {method, url, data, isNeedSign} = this;
    if (isNeedSign) {
      data = getMallRequest(data, method);
    }
    return axios({
      url, data,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
  }
}

export function getMachineLoveData(param, method) {
  let getData = new GetDataApi({
    url: "/api/MachineLoveAPI",
    data: param,
    method,
    isNeedSign: true
  });
  return getData.getData()
}

export function getFromPhpData(param, method) {
  let getData = new GetDataApi({
    url: "/api/FromPhpAPI",
    data: param,
    method,
    isNeedSign: true
  });
  return getData.getData()
}

export function getTestApiData(param) {
  let getData = new GetDataApi({
    url: "/api/TestAPI",
    data: transReqStr(param),
    isNeedSign: false
  });
  return getData.getData()
}

export function getMallRequest(params, method) {
  var appid = 'aggtonglianpay';
  var key = 'AGGTL1524';
  var plusSign = 'plus_sign';
  var starSign = 'star_sign';

  var num = Math.random() * 900000 + 99999;
  var ran = parseInt(num, 10);
  var tim = Date.parse(new Date());
  var params = encodeArray2D(params);
  var str = "apidata=" + params + "&appid=" + appid + "&format=json&method=" + method + "&nonce=" + ran + "&tstamp=" + tim + "&version=1.0";
  str = str.replace(/\+/g, plusSign);
  str = str.replace(/\*/g, starSign);
  var beforeStr = urlencode(str).toLowerCase() + key;
  var sign = md5(beforeStr);
  var result = str + "&sign=" + sign + "&urlPrefix=m.abutbeauty.com&tempContextUrl=m.abutbeauty.com&method=" + method;
  return result;
}

/**
 * 将二维数组转为 json 字符串
 */
function encodeArray2D(obj) {
  var array = [];
  for (var i = 0; i < obj.length; i++) {
    array[i] = "'" + obj[i].join("':'") + "'";
  }
  return '{' + array.join(',') + '}';
}

function urlencode(clearString) {
  var output = '';
  var x = 0;

  clearString = utf16to8(clearString.toString());
  var regex = /(^[a-zA-Z0-9-_.]*)/;

  while (x < clearString.length) {
    var match = regex.exec(clearString.substr(x));
    if (match != null && match.length > 1 && match[1] != '') {
      output += match[1];
      x += match[1].length;
    }
    else {
      if (clearString[x] == ' ')
        output += '+';
      else {
        var charCode = clearString.charCodeAt(x);
        var hexVal = charCode.toString(16);
        output += '%' + (hexVal.length < 2 ? '0' : '') + hexVal.toUpperCase();
      }
      x++;
    }
  }

  function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      }
      else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
      else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  }

  return output;
}

//将请求对象转化为使用&相连的形式
function transReqStr(reqObj) {
  let result = '';
  for (let key in reqObj) {
    result = result + `${key}=${reqObj[key]}&`
  }
  return result
}
