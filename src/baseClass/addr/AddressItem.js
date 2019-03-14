export default class AddressItem{
  constructor(addr){
    this.receiverName=addr.receive_name;
    this.phone=addr.receive_phone;
    this.province=addr.consignee_province;
    this.city=addr.consignee_city||'';
    this.area=addr.consignee_district||'';
    this.addrId=addr.id;
    this.idNumber=addr.receive_idnumber||'';
    this.detail=addr.receive_address;
    this.allAddr=getAllAddr(addr);
    this.isDefault=addr.is_default=='N'?false:true
  }
}

//整合地址信息
function getAllAddr(addr){
  let {consignee_province,consignee_city,consignee_district,receive_address}=addr;
  return `${consignee_province}${consignee_city}${consignee_district}${receive_address}`
}
