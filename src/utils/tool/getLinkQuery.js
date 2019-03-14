//获取链接的query
export default function getLinkQuery(path){
  let queryString=path.split('?')[1];
  if(!queryString){
    return null
  }
  let queryArr=new URLSearchParams(queryString);
  let query={};
  for(let i of queryArr){
    query[i[0]]=i[1]
  }
  return query
}
