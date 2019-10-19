# 引言
***
此篇文章主要涉及以下内容：
1. `UI`库选型思路
2. 全家桶融会贯通`vue-router`+`vuex`
3. 前端登录和权限控制
4. 前后端交互
5. 解决跨域问题
# 学习资源
***
1. `UI`库：[cube-ui](https://didi.github.io/cube-ui/#/zh-CN)
2. 后端接口编写：[koa](https://koa.bootcss.com/)
3. 请求后端接口：[axios](http://www.axios-js.com/)
    着重关注请求、响应拦截
4. 令牌机制：[Bearer Token](http://www.rfcreader.com/#rfc6750)
5. 代理配置、mock数据：[vue-cli配置指南](https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)、[webpack配置指南](https://cli.vuejs.org/zh/config/#%E5%85%A8%E5%B1%80-cli-%E9%85%8D%E7%BD%AE)
# 开发环境
***
1. [vscode下载](https://code.visualstudio.com/)
2. [node.js下载](https://nodejs.org/en/)
# 选择一个合适的UI库
***
![](https://upload-images.jianshu.io/upload_images/15424855-33b9feb6ce15999b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
vue add cube-ui
```
# 扩展性
***
任何`ui`库都不能满足全部的业务开发需求，都需要自己进行定制和扩展，组件化设计思路至关重要
# 登录页面
***
- 安装`router`:`vue add router`
- 安装`vuex`:`vue add vuex`
- 配置路由`router.js`
![](https://upload-images.jianshu.io/upload_images/15424855-af0f5dcc1ebf5af2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/about",
      name: "about",
      meta: {
        auth: true
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    // 需要登录
    const token = localStorage.getItem("token");
    if (token) {
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: to.path }
      });
    }
  } else { // 不需要登录验证
    next()
  }
});

export default router;

```
- 登录状态，store.js
```
export defalut new Vuex.Store({
  state: {
    isLogin: false
  },
  mutations: {
    setLoginState(state, b) {
      state.isLogin = b;
    }
  },
  actions: {}
})
```
- 登录表单：[cube-ui的表单文档](https://didi.github.io/cube-ui/#/zh-CN/docs/form)
```
<div>
    <div class="logo">
      <img src="https://img.kaikeba.com/logo-new.png"
           alt>
    </div>
    <!-- <cube-button>登录</cube-button> -->
    <cube-form :model="model"
               :schema="schema"
               @submit="handleLogin"
               @validate="haneldValidate"></cube-form>
  </div>
```
分别设置`model`和`schema`
```
 model: {
        username: "",
        passwd: ""
      },
      schema: {
        // 表单结构定义
        fields: [
          // 字段数组
          {
            type: "input",
            modelKey: "username",
            label: "用户名",
            props: {
              placeholder: "请输入用户名"
            },
            rules: {
              // 校验规则
              required: true
            },
            trigger: "blur"
          },
          {
            type: "input",
            modelKey: "passwd",
            label: "密码",
            props: {
              type: "password",
              placeholder: "请输入密码",
              eye: {
                open: true
              }
            },
            rules: {
              required: true
            },
            trigger: "blur"
          },
          {
            type: "submit",
            label: "登录"
          }
        ]
      }
```
`model`就是输入框绑定的数据，`schema`是具体的表单的描述，会动态渲染一个表单
每次校验都会触发 `handleValidate`方法，打印校验的结果
```
handleValidate(ret){
  console.log(ret)
}
```
点击登录触发`handleLogin`发起登录请求
Login.vue
```
handleLogin (e) {
      // 组织表单默认提交行为
      e.preventDefault();
      // 登录请求
      //   this.login(this.model) // 使用mapActions
      this.$store
        .dispatch("login", this.model)
        .then(code => {
          if (code) {
            // 登录成功重定向
            const path = this.$route.query.redirect || "/";
            this.$router.push(path);
          }
        })
        .catch(error => {
          // 有错误发生或者登录失败
          const toast = this.$createToast({
            time: 2000,
            txt: error.message || error.response.data.message || "登录失败",
            type: "error"
          });
          toast.show();
        });
    },
```
登录动作编写：提交登录请求，成功后缓存`token`并且提交至`store`里
store.js
```
import Vue from "vue";
import Vuex from "vuex";
import us from "./service/user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: localStorage.getItem('token') ? true : false
  },
  mutations: {
    setLoginState(state, b) {
      state.isLogin = b;
    }
  },
  actions: {
    login({ commit }, user) {
      // 登录请求
      return us.login(user).then(res => {
        const { code, token } = res.data;
        if (code) {
          // 登录成功
          commit("setLoginState", true);
          localStorage.setItem("token", token);
        }
        return code;
      });
    }
  }
});

```
编写接口服务
service/user.js
```
import axios from 'axios'

export default {
    login(user){
        return axios.get('/api/login', {params:user})
    }
}
```
> `webpack devServer`对`post`支持不好，这里暂时使用`get`请求

```
configureWebpack: {
  devServer: {
    before(app) {
      app.get('/api/login', function (req, res) {
        const {
          username,
          passwd
        } = req.query;
        console.log(username, passwd);

        if (username === 'xxx' && password === 'xxx') {
          res.json({
            code: 1,
            token: 'abcdtoken'
          });
        } else {
          res.status(401).json({
            code: 0,
            message: '用户名或密码错误'
          })
        }
      })
    }
  }
}
```
# 检查点
***
- 如何路由守卫
- 如何进行异步操作
- 如何保存登录状态
- 如何模拟接口
# http拦截器
***
有了`token`之后，每次`http`请求发出，都要加在`header`上
```
// interceptor.js
const axios=require('axios')

export default function(){
  axios.interceptors.request.use(config=>{
    const token=localStorage.getItem('token')
    if(token){
      config.headers.token=token;
    }
    return config;
  })
}

// 启用 main.js
import interceptor from './interceptor'
interceptor()
```
可以通过登录接口测试拦截器效果，但是不合理，我们编一个用户信息接口，需要携带token才能访问
```
// mock接口 vue.config.js
function auth(req, res, next) {
  if (req.headers.token) {
    // 已认证
    next()
  } else {
    res.sendStatus(401)
  }
}

app.get('/api/userinfo', auth, function (req, res) {
  res.json({
    code: 1,
    data: {
      name: 'xxx',
      age: '18'
    }
  })
})
// 清localStorage测试
```
# 注销
***
- 需要清除`token`缓存的两种情况：
    1. 用户主动注销
    2. token过期
-  需要做的事情：
    1. 清空缓存
    2. 重置登录状态
- 用户主动注销
```
// app.vue
<button v-if="$store.state.isLogin" @click="logout">注销</button>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  },
}
// store.js
    logout({ commit }){
      // 清缓存
      localStorage.removeItem('token')
      // 重置状态
      commit("setLoginState", false);
    }
```
- token过期导致请求失败的情况可能出现在项目的任何地方，可以通过响应拦截统一处理
# http拦截响应
***
统一处理401状态码，清理`token`跳转`login`
```
// interceptor.js
export default function(vm){ // 传入vue实例
  // ...
  // 响应拦截
  // 这里只关心失败响应
  axios.interceptors.response.use(null,err=>{
    if(err.respinse.status===401){
      // 清空vuex和localstorage
      vm.$store.dispatch('logout')
      // 跳转login
      vm.$router.push('/login')
    }
    return Promise.reject(err)
  })
}

// app.vue
const app=new Vue({...}).$mount('#app')
interceptor(app) // 传入vue实例
```
# 深入理解令牌机制
***
- [Bearer Token规范](http://www.rfcreader.com/#rfc6750)
    - 概念：描述在`HTTP`访问`OAuth2`保护资源时如何使用令牌的规范
    - 特点：令牌就是身份证明，无需证明令牌的所有权
    - 具体规定：在请求头中定义`Authorization`
    ```
    Authorization:Bearer <token>
    ```
- [Json Web Token规范](https://jwt.io/)
    - 概念：令牌的具体定义方式
    - 规定：令牌由三部分构成‘头，载荷，签名’
    - 头：包含加密算法、令牌类型等信息
    - 载荷：包含用户信息、签发时间和过期时间等信息
    - 签名：根据头、载荷及秘钥加密得到的哈希串 HMac Sha1 256
- 实践：
    - 服务端：-server/server.js
    ```
    const Koa = require("koa");
    const Router = require("koa-router");
    // 生成令牌、验证令牌
    const jwt = require("jsonwebtoken");
    const jwtAuth = require("koa-jwt");

    // 生成数字签名的秘钥
    const secret = "it's a secret";

    const app = new Koa();
    const router = new Router();

    router.get("/api/login", async ctx => {
      const { username, passwd } = ctx.query;
      console.log(username, passwd);

      if (username == "kaikeba" && passwd == "123") {
        // 生成令牌
        const token = jwt.sign(
          {
            data: { name: "kaikeba" }, // 用户信息数据
            exp: Math.floor(Date.now() / 1000) + 60 * 60 // 过期时间
          },
          secret
        );
        ctx.body = { code: 1, token };
      } else {
        ctx.status = 401;
        ctx.body = { code: 0, message: "用户名或者密码错误" };
      }
    });

    router.get(
      "/api/userinfo",
      jwtAuth({ secret }),
      async ctx => {
        ctx.body = { code: 1, data: { name: "jerry", age: 20 } };
      }
    );
    app.use(router.routes());
    app.listen(3000);
    ```
- 修改配置文件：启用开发服务器代理，vue.config.js
    ```
    devServer: {
      proxy: {
        "/api": {
            target: "http://127.0.0.1:3000/", 
            changOrigin: true
        }
      }, 
    ```
- 拦截器的修改，interceptor.js
    ```
    config.headers.Authorization='Bearer'+token
    ```
