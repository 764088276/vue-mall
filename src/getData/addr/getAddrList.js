// import {getFromPhpData} from "../../utils/tool/getData";
import {userid,cid} from '../../utils/constData'
import {getMallRequest} from "../../utils/tool/getData";
import axios from 'axios'

function getFromPhpData(param,method){
  let url="/api/FromPhpAPI";
  let data=getMallRequest(param,method);
  return axios({
    url,
    data,
    method:'post',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

export default function getAddrList(){
  let param=[
    ['cid',cid],
    ['userid',userid]
  ];
  return getFromPhpData(param,"getReceiveAddressList");
}

