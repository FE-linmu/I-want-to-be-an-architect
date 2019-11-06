// 实现一个文件系统读写数据库
const fs=require('fs')

function get(key){
    fs.readFile("./db.json",(err,data)=>{
        const json=JSON.parse(data)
        console.log(json[key])
    })
}

function set(key,value){
    fs.readFile("./db.json",(err,data)=>{
        // 可能是空文件，则设置为空对象
        const json=data?JSON.parse(data):{}
        json[key]=value // 设置值
        // 重新写入文件
        fs.writeFile("./db.json",JSON.stringify(json))
    })
}