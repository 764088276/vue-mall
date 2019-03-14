import axios from 'axios'

//上传文件
export default function uploadFile(file){
  let formData=new FormData();
  formData.append('file',file);
  let reqObj={
    url:'/upload',
    data:formData,
    method:'post',
    header: {
      'content-type': 'multipart/form-data'
    }
  };
  return axios(reqObj)
}
