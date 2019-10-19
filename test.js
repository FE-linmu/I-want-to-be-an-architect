devServer:{
  // 代理配置
  proxy:{
    '/api':{
      target:'http://127.0.0.1:3000/',
      changOrigin:true
    }
  }
}