# 引言
***
此篇文章主要涉及以下内容：
1. `nodejs`特点和应用场景
2. `node`模块系统使用
3. 核心`api`使用  
4. 简版`Express`服务器
# 学习资源
***
1. [NodeJS](http://nodejs.cn/)
#NodeJS是什么
***
node.js是一个异步的事件驱动的JavaScript**运行时**
node.js特性：
- 非阻塞I/O
- 事件驱动
> 类比学习运行时这个概念
>- JRE Java运行时环境
>- C Runtion
>- .NET Common Language Runtime
>
>运行时runtime就是**程序运行的时候**
>运行时库就是程序运行的时候所需要依赖的库
>运行的时候指的是指令加载到内存并由CPU执行的时候。
>C代码编译成可执行文件的时候，指令没有被CPU执行，这个时候算是编译时，就是**编译的时候**。

并发处理
- 多进程 -C
- 多进程 -Java
- 异步IO -js
- 协程 - lua go openresty
>下一代Node   deno
>https://studygolang.com/articles/13101
##准备工作
- 运行node程序：`node xxx.js`
>每次修改JS文件需重新执行才能生效，安装nodemon可以监视文件改动，自动重启：npm i -g nodemon 
- 调试node程序：`Debug -Start Debugging`
- 使用模块（module）
    - node内建模块
    ```
    require('os')
    ```
    - 第三方模块
    ```
    require('cpu-start')
    ```
    - 自定义模块
    ```
     // 导出
    module.exports = {}
    // 导入
    require('./conf')
    ```

##核心api
- fs 文件系统
```
const fs=require('fs');

fs.readFile('./xxx.md',(err,data)=>{
  if(err) throw err
  console.log(data)
})
```
- buffer
```
// 创建
const buf1 = Buffer.alloc(10)
const buf2 = Buffer.from([1,2,3])
const buf3 = Buffer.from('Buffer创建方法')

// 写入
buf1.write('hello')

// 读取
console.log(buf3.toString())

// 合并
const buf4 = Buffer.concat([buf1,buf3])
```
- http
```
const http = require('http')
const server = http.createServer((request,response)=>{
  console.log('there is a request')
  response.end('a response from server')
})
server.listen(3000)
```
- stream
```
const rs = fs.createReadStream('./conf.js')
const ws = fs.createWriteStream('./conf2.js')
rs.pipe(ws)
```
##仿写一个简版Express
- 体验express
```
// npm i express
const express = require('express')
const app=express()
app.get('/',(req,res)=>{
  res.end('hello world')
})
app.get('/users',(req,res)=>{
  res.end(JSON.stringify([{name:'tom',age:20}]))
})
app.listen(3000,()=>{
  console.log('example app listen at 3000')
})
```
- 实现kexpress
```
const http = require('http')
const url = require('url')

let router = []

class Application{
  get(path,handler){
    console.log('get...',path)
    if(typeof path === 'string'){
      router.push({
        path,
        method:'get',
        handler
      })
    }else{
      router.push({
        path:'*',
        method:'get',
        handler:path
      })
    }
  }
  listen(){
     // 在application原型上添加listen方法匹配路径，执行对应的handler方法
  const server = http.createServer(function(req,res){
      console.log(url.parse(req.url,true))
      let {pathname} = url.parse(req.url,true)
      router.forEach(route => {
        let {path,method,handler} = route
        if (pathname === path && req.method.toLowerCase() === method){
          return handler(req,res)
        }
        if (path === '*'){
          return handler(req,res)
        }
      })
    })
    server.listen(...arguments)
  }
}
module.exports = function createApplication() {
  return new Application()
}
```