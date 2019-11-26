// 测试里面直接利用HTTP模块进行调用请求
var http = require('http');
setInterval(async () => {
    try {
        // 使用async、await进行调用
        await http.get('http://localhost:3000');
        console.log('go')
    } catch (error) {
    }
}, 1000)