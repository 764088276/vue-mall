/**
 * Created by HG on 2017/12/13.
 */
var express=require("express");
var config=require('./config/index.js');
var app = express();
var proxy=require('http-proxy-middleware');


app.use('/api',proxy('/api',{
  'target':'https://wxapi.ajyaguru.com/jiangziAPI/servlet',
  'changeOrigin':true,
  pathRewrite:{
    '^/api':''
  }
}))

app.use('/upload',proxy('/upload',{
  'target':'https://wxapi2.ajyaguru.com/backend/user/uplode',
  'changeOrigin':true,
  pathRewrite:{
    '^/upload':''
  }
}))
//配置静态资源路径
app.use(express.static('./dist'));

var port=process.env.PORT||config.build.port;
module.exports=app.listen(port,function(err){
  if(err){
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:'+port+'\n')
})

