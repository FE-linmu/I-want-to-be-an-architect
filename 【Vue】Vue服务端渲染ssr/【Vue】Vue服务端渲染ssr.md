# 引言
***
此篇文章主要涉及以下内容：
1. SSR服务端渲染流程图
2. SSR优势
3. Vue SSR实战
4. Vue SSR框架 nuxt.js
# 学习资源
***
- [vue ssr](https://ssr.vuejs.org/zh/)
- [nuxt.js](https://zh.nuxtjs.org/)
# 理解ssr
***
## CSR VS SSR
传统的web开发
![](https://upload-images.jianshu.io/upload_images/15424855-e7c88d588e24d37a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
  // npm i express -S
  const express = require('express')
  const app = express()

  app.get('/', function (req, res) {
    res.send(
      `
      <html>
        <body>
          <div>
            <h1>test</h1>
          </div>
        </body>
      </html>
      `
    )
  })

  app.listen(3000, () => {
    console.log('启动成功')
  })
```
打开项目，查看源码
![](https://upload-images.jianshu.io/upload_images/15424855-c28fb5edc1da8d74.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

浏览器拿到的，就是全部的dom结构
## SPA时代
到了vue，react时代，单页应用优秀的用户体验，逐渐成为了主流，页面整体是js渲染出来的，称之为客户端渲染CSR
![](https://upload-images.jianshu.io/upload_images/15424855-76700b7a7c1363bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/15424855-d34ea47484c9243f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这里可以看到单页应用的两个缺点：
1. **首屏渲染等待时长**：必须等js加载完毕，并且执行完毕，才能渲染出首屏
2. **SEO不友好**：爬虫只能拿到一个div，认为页面是空的，不利于SEO
## SSR
为了解决这两个问题，出现了SSR解决方案，后端渲染出完整的首屏的dom结构返回，前端拿到的内容带上首屏，后续的页面操作，再用单页的路由跳转和渲染，称之为服务端渲染（server side render）

![](https://upload-images.jianshu.io/upload_images/15424855-df40cdaa597efef0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### ssr体验：nuxt.js
Nuxt.js是一个基于vue.js的**通用应用框架**。
通过对客户端/服务端基础架构的抽象组织，Nuxt.js主要关注的是应用的**UI渲染**。
> 结论：
>     1. nuxt不仅仅用于服务端渲染也可用于spa应用开发；
>     2. 利用nuxt提供的基础项目结构、异步数据加载、中间件支持、布局等特性可大幅提高开发效率
>     3. nuxt可用于网站静态化
### nuxt.js特性
- 基于vue.js
- 自动代码分层
- 服务端渲染
- 强大的路由功能，支持异步数据
- 静态文件服务
- ES6/ES7语法支持
- 打包和压缩JS和CSS
- HTML头部标签管理
- 本地开发支持热加载
- 集成ESLint
- 支持各种样式预处理器：SASS、LESS、Stylus等等
- 支持HTTP/2推送
### nuxt渲染流程
一个完整的服务器请求到渲染的流程

![](https://upload-images.jianshu.io/upload_images/15424855-c310d9b5a550e22c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### nuxt安装
运行 create-nuxt-app
```
npx create-nuxt-app <项目名>
```
>运行项目：`npm run dev`
目录结构：
assets：资源目录`assets`用于组织未编译的静态资源如`LESS`、`SASS`或`Javascript`.
components：组件目录`components`用于组织应用的Vue.js组件。Nuxt.js不会扩展增强该目录下Vue.js祖江，即这些组件不会像页面组件那样有`asyncData`方法的特性。
layouts：布局目录`layouts`用于组织应用的布局组件。
middleware:`middleware`目录用于存放应用的中间件。
pages：页面目录`pages`用于组织应用的路由及视图。Nuxt.js框架读取该目录下所有的`.vue`文件并自动生成对应的路由配置
plugins：插件目录`plugins`用于组织那些需要在根`vue.js`应用实例化之前需要运行的js插件。
static：静态文件目录`static`用于存放应用的静态文件，此类文件不会被Nuxt.js调用Webpack进行构建编译处理。服务器启动的时候，该目录下的文件会映射至应用的根路径`/`下。
store：store目录用于组织应用的Vuex状态树文件。Nuxt.js框架集成了Vuex状态树的相关功能配置，在store目录下创建一个index.js文件可激活这些配置。
nuxt.config.js：`nuxt.config.js`文件用于组织Nuxt.js应用的个性化配置，以便覆盖默认配置。
### 约定优于配置
pages目录中所有`*.vue`文件生成应用的路由配置，新建pages/users.vue
```
/* 展示模板 */
<template>
<div id='app'>
  用户列表
</div>
</template>
<script>
//导入组件
export default {
name: 'App'
}
</script>
<style>
/* 样式代码 */
#app {
}
</style>
```
>访问：http://localhost:3000/users
### 路由
#### 导航
```
<nuxt-link to='/users'>用户列表</nuxt-link>
```
>功能和router-link等效
#### 基础路由
修改pages中页面组织如下
```
pages/
--|  users/
----|  index.vue
----|  detail.vue
--|  index.vue
```
Nuxt.js自动生成的路由配置如下：
```

router:{
  routes:[
    {
      name:'index',
      path:'/',
      component:'pages/index.vue'
    },
    {
      name:'users',
      path:'/users',
      component:'pages/users/index.vue'
    },
    {
      name:'users-detail',
      path:'/users/detail',
      component:'pages/users/detail.vue'
    }
  ]
}
```
测试代码，index.vue
```
// 移动users.vue至users/并重命名为index.vue
// 在users/创建detail.vue
<el-button @click="$router.push('users')">用户列表</el-button>
<el-button @click="$router.push({name:'users-detail'})">用户列表</el-button>
```
#### 动态路由
以下划线作为前缀的Vue文件或目录会被定义为动态路由，如下面文件结构
```
pages/
--|  users/
----|  _id.vue
```
会生成如下路由配置:
```
{
  name:'users-id',
  path:'/users/:id',
  component:'pages/users/_id.vue'
}
```
> id是必选参数，如果users/里面不存在index.vue，它将被作为可选参数

测试代码，index.vue
```
    //创建users/_id.vue
    <el-button @click="$router.push({name:'users-detail',query:{id:1}})">用户列表</el-button>
    <el-button @click="$router.push({name:'users-id',params:{id:1}})">用户列表</el-button>
```
#### 嵌套路由
构造文件结构如下：
```
pages/
--|  users/
----|  _id.vue
----|  index.vue
--|  users.vue
```
生成的路由配置如下：
```
{
  path: '/users',
  component: 'pages/users.vue',
  children: [
    {
      path: '',
      component: 'pages/users/index.vue',
      name: 'users'
    },
    {
      path: ':id',
      component:'pages/users/_id.vue',
      name:'users-id'
    }
  ]
}
```
测试代码，users.vue
```
<template>
  <div>
    用户中心
    <nuxt-child/>
  </div>
</template>
```
> nuxt-child等效于router-view
### 视图
下图展示了Nuxt.js如何为指定的路由配置数据和视图
![](https://upload-images.jianshu.io/upload_images/15424855-f517e80fb27e683d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
#### 默认布局
查看 layouts/default.vue
```
<template>
  <nuxt/>
</template>
```
#### 自定义布局
创建 layouts/users.vue
```
<template>
  <div>
    <h1>用户导航在这里</h1>
    <nuxt/>
  </div>
</template>
```
告诉页面 pages/users.vue 使用自定义布局：
```
export default {
  layout:'users'
}
```
#### 错误页面
创建 layouts/error.vue
```
<template>
  <div class="container">
    <h1 v-if="error.statusCode===404">页面不存在</h1>
    <h1 v-else>
      应用发生错误异常
    </h1>
    <nuxt-link to="/">首页</nuxt-link>
  </div>
</template>
<script>
export default {
  props: ['error']
}
</script>
```
测试代码，users.vue
```
// 添加一个不存在数据访问
{{foo.bar}}
```
####页面
页面组件实际上是vue组件，只不过Nuxt.js为这些组件添加了一些特殊的配置项
```
<script>
export default {
  asyncData (context) {
    //每次组件加载前调用
    return { name: 'World' }
  },
  head () {
    //设置页面meta
  },
  // 其他功能
  ...
  }
</script>
```
示例代码，users.vue
```
export default{
  head:{// 修改页面标题
    title:'用户列表'
  }
};
```
#### 异步数据获取
`asyncData`方法使得我们可以在设置组件的数据之前能异步获取或处理数据。
范例代码：获取异步数据
```
<template>
  <div>
    用户列表
    <ul>
      <li v-for='user in users'
          :key='user.id'>{{user.name}}</li>
    </ul>
  </div>
</template>

<script>
function getUsers () {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{ name: 'tom', id: 1 }, { name: 'jerry', id: 2 }])
    }, 1500)
  })
}

export default {
  // 可以返回Promise
  // asyncData(){
  //   return getUsers().then(users=>({users}))
  // }
  // 也可以使用async/await
  async asyncData () {
    // 使用async/await
    const users = await getUsers()
    return { users }
  }
}
</script>
```
>注意事项：
    1. asyncData方法会在组件（限于页面组件）每次加载之前被调用
    2. asyncData可以在服务端或路由更新之前被调用
    3. 第一个参数被设定为当前页面的上下文对象
    4. Nuxt.js会将asyncData返回的数据融合组件data方法返回的舒服一并返回给当前组件
    5. 由于asyncData方法是在组件初始化前被调用的，所以在方法内是没有办法通过this来引用组件的实例对象
#### 上下文对象的使用
users/detail.vue
```
<script>
export default {
  async asyncData ({ query, error }) {
    if (query.id) {
      return { user: { name: 'tom' } }
    }
    error({ statusCode: 400, message: '请传递用户id' })
  }
}
</script>
```
>可以从上下文获取参数、错误处理函数、重定向函数等等有用对象

####整合axios
安装@nuxt/axios： `npm i @nuxtjs/axios`
配置：nuxt.config.js
```
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    proxy: true
  }
  proxy:{
    '/api/':'http://localhost:3001/'
  }
```
测试代码：
```
// 修改users/_id.vue
async asyncData({ params, $axios }) {
    // 注意返回的就是响应数据
    const data = await $axios.$get(`/api/users/${params.id}`);
    if (data.ok) {
      return { user: data.user };
    }
    error({ statusCode: 400, message: "id有误，查询失败" });
  }

// 创建server/api-server.js
// npm i koa-router
const Koa = require("koa");
const app = new Koa();
const Router = require('koa-router')
const router = new Router({prefix:'/api/users'})

const users = [{ name: "tom", id: 1 }, { name: "jerry", id: 2 }];

router.get('/:id', ctx => {
    const user = users.find(u => u.id == ctx.params.id)
    if (user) {
        ctx.body = {ok:1, user};
    }
    else {
        ctx.body = {ok:0}
    }
})

app.use(router.routes());
app.listen(3001);
```
拦截器实现：
```
// nuxt.config.js
plugins:[
  '~/plugins/axios'
]

// 创建plugins/axios.js
export default function({$axios,redirect}){
  // onRequest为请求拦截器帮助方法
  $axios.onRequest(config=>{
    if(!process.server)
      config.headers.token='jilei'
  })
}
```
#### vuex
应用根目录下如果存在store目录，Nuxt.js将启用vuex状态树。
定义各状态树时具名导出state，mutations，getters，actions即可
```
// store/index.js
export const state = () => ({
    counter: 0
})

export const mutations = {
    increment(state) {
        state.counter++
    }
}

// store/users.js
export const state = () => ({
  list: []
});

export const mutations = {
  set(state, list) {
    state.list = list;
  },
  add(state, name) {
    state.list.push({ name });
  }
};
```
生成状态树如下：
```
new Vuex.Store({
  state: () => ({
    counter: 0
  }),
  mutations: {
    increment(state) {
      state.counter++
    }
  },
  modules: {
    users: {
      namespaced: true,
      state: () => ({
        list: []
      }),
      mutations: {
        set(state, list) {
          state.list = list;
        },
        add(state,{text}){
          state.list.push({
            text,
            done:false
          })
        }
      }
    }
  }
})
```
使用状态，index中处于根，其他文件以文件名作为模块名，users/index.vue
```
<template>
  <div>
    用户列表
    <p @click="increment">计数: {{counter}}</p>
    <p>
      <input type="text" placeholder="添加用户" @keyup.enter="add($event.target.value)">
    </p>
    <ul>
      <li v-for="user in list" :key="user.id">{{user.name}}</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

function getUsers() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{ name: "tom", id: 1 }, { name: "jerry", id: 2 }]);
    }, 1500);
  });
}

export default {
  fetch({ store }) {
    // fetch在创建组件前执行填充状态树
    // 提交时注意命名空间
    return getUsers().then(users => store.commit("users/set", users));
  },
  computed: {
    ...mapState(["counter"]),
    ...mapState("users", ["list"])
  },
  methods: {
    ...mapMutations(["increment"]),
    ...mapMutations("users", ["add"])
  }
};
</script>

<style scoped>
</style>
```
# Vue SSR实战
***
## 新建工程
```
vue create ssr
```
## 安装vsr
```
npm install vue-server-renderer --save
```
```
const express = require('express')
const Vue = require('vue')

const app = express()
const renderer = require('vue-server-renderer').createRenderer()
const page = new Vue({
  data: {
    name: 'XXXXXX',
    count: 1
  },
  template: `
    <div>
      <h1>{{name}}</h1>
      <h1>{{count}}</h1>
    </div>
  `
})

app.get('/', async function (req, res) {
  const html = await renderer.renderToString(page)
  res.send(html)
})

app.listen(3000, () => {
  console.log('启动成功')
})
```
## 构建步骤
![](https://upload-images.jianshu.io/upload_images/15424855-aeb763251526197c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
> 通常前端都是vue单文件组件，用vue-loader构建，所以ssr环境需要webpack，怎么操作呢，下面开始
## 路由Vue-router
单页应用的页面路由，都是前端控制，后端只负责提供数据
一个简单的单页应用，使用vue-router，为了方便前后端公用路由数据，我们新建router.js对外暴露createRouter
```
npm i vue-router -S
```
```
// router.js
import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index'
import Kkb from './components/Kkb'
Vue.use(Router)


export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
        {path:"/",component:Index },
        {path:"/kkb",component:Kkb },
      // ...
    ]
  })
}
```
```
// src/components/index.vue
<template>
    
    <div>
        <h1>hi {{name}}</h1>
    </div>
</template>

<script>
export default {
    data(){
        return {
            name:'首页'
        }
    }
}
</script>

```
```
src/components/kkb.vue
<template>
    
    <div>
        <h1>hi {{name}}</h1>
        <h2>num:{{$store.state.count}}</h2>
    </div>
</template>

<script>
export default {
    data(){
        return {
            name:'kkk'
        }
    }
}
</script>
```
```
// app.vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <ul>
      <li>
        <router-link to="/">首页</router-link>
      </li>
      <li>
        <router-link to="/kkb">开课吧</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>


</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
</style>
```
## csr和ssr统一入口
```
/ src/createapp.js
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'

export function createApp (context) {
    const router = createRouter()
    const store = createStore()
    const app = new Vue({
        router,
        store,
        context,
        render: h => h(App)
    })
    return { app, router }
}
```
csr的main.js
```
// src/main.js
import { createApp } from './createapp'

const { app, router } = createApp()
router.onReady(() => {
    app.$mount('#app')
})
```
ssr的entry-server.js
```
// src/entry-server.js
import { createApp } from './createapp'

export default context => {
    // 我们返回一个 Promise
    // 确保路由或组件准备就绪
    return new Promise((resolve, reject) => {
        const { app, router } = createApp(context)
        router.push(context.url)
        router.onReady(() => {
            resolve(app)
        }, reject)
    })
}
```
服务端渲染，我们需要能够处理加载.vue 组件，所以需要webpack的支持
## 后端加入webpack
配置和代码如下：
```
npm i cross-env vue-server-renderer webpack-node-externals lodash.merge --save
```
具体配置
```
// vue.config.js
// vue.config.js

const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const nodeExternals = require("webpack-node-externals");
const merge = require("lodash.merge");
const TARGET_NODE = process.env.WEBPACK_TARGET === "node";
const target = TARGET_NODE ? "server" : "client";


module.exports = {
  css: {
    extract: false
  },
  configureWebpack: () => ({
    // 将 entry 指向应用程序的 server / client 文件
    entry: TARGET_NODE ?`./src/entry-${target}.js`:'./src/main.js',
    // 对 bundle renderer 提供 source map 支持
    devtool: 'source-map',
    target: TARGET_NODE ? "node" : "web",
    node: TARGET_NODE ? undefined : false,
    output: {
      libraryTarget: TARGET_NODE ? "commonjs2" : undefined
    },
    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，
    // 并生成较小的 bundle 文件。
    externals: TARGET_NODE
      ? nodeExternals({
          // 不要外置化 webpack 需要处理的依赖模块。
          // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
          // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
          whitelist: [/\.css$/]
        })
      : undefined,
    optimization: {
          splitChunks: undefined
    },
    plugins: [TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
  }),
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options => {
        merge(options, {
          optimizeSSR: false
        });
      });
  }
};
```
服务器启动文件
```
// server.js


const fs = require("fs");
const express = require('express')
const app =express()

// 开放dist目录
app.use(express.static('./dist'))

// 第 2 步：获得一个createBundleRenderer
const { createBundleRenderer } = require("vue-server-renderer");
const bundle = require("./dist/vue-ssr-server-bundle.json");
const clientManifest = require("./dist/vue-ssr-client-manifest.json");

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync("./src/index.temp.html", "utf-8"),
  clientManifest: clientManifest
});

function renderToString(context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      resolve(html);
    });
  });
}

app.get('*',async (req,res)=>{
  console.log(req.url,123)
  const context = {
    title:'ssr test',
    url:req.url
  }
  const html = await renderToString(context);
  res.send(html)
})

const port = 3001;
app.listen(port, function() {
  console.log(`server started at localhost:${port}`);
});
```
宿主文件
```
// src/index.temp.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <!--vue-ssr-outlet-->
    <script>
window.init_state_ssr =${data}
      </script>
  </body>
</html>
```
脚本配置
```
// package.json
"scripts": {
    "serve": "vue-cli-service serve",
    "build:client": "vue-cli-service build",
    "build:server": "cross-env WEBPACK_TARGET=node vue-cli-service build --mode server",
    "build": "npm run build:server && mv dist/vue-ssr-server-bundle.json bundle && npm run build:client && mv bundle dist/vue-ssr-server-bundle.json",
    "lint": "vue-cli-service lint"
  },
```
![](https://upload-images.jianshu.io/upload_images/15424855-f2dde6bbdcfedb5e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
