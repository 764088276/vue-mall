const storage={
  setItem(key,value){
    let _value=value;
    if(typeof value =='object'){
      _value=JSON.stringify(_value)
    }
    localStorage.setItem(key,_value);
  },
  getItem(key){
    let _result=localStorage.getItem(key);
    let result='';
    try{
      result=JSON.parse(_result)
    }catch(err){
      result=_result
    }
    return result
  },
  clearAll(){
    localStorage.clear();
  },
  removeItem(key){
    localStorage.removeItem(key)
  }
};
export default storage
