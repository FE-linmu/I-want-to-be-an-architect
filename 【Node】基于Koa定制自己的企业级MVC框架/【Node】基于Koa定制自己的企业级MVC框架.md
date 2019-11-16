# 引言
***
此篇文章主要涉及以下内容：
1. 企业级`web`开发框架`egg.js`使用
2. 基于`koa`定制自己的企业级`MVC`框架
# Egg.js体验
***
- 架构
![](https://upload-images.jianshu.io/upload_images/15424855-724e0976ca565708.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 创建项目
```
//创建项目
npm i egg-init -g
egg-init egg-example --type=simple
cd egg-example
npm i

//启动项目
npm run dev
open localhost:7001
```
- 浏览项目结构：
    - Public
    - Router->Controller->Service->Model
    - Schedule
- 创建一个路由，route.js
```
router.get('/user',controller.user.index)
```
- 创建一个控制器，user.js
```
'use strict'
const Controller = require('egg').Controller

class UserController extends Controller {
  async index(){
    this.ctx.body = [
      {name:'tom'},
      {name:'jerry'}
    ]
  }
}
module.exports = UserController
```
- 创建一个服务，./app/service/user.js
```
'use strict'
const Service = require('egg').Service

class UserService extends Service{
  async getAll(){
    return [
      {name:'tom'},
      {name:'jerry'}
    ]
  }
}
module.exports = UserService
```
- 使用服务，./app/controller/user.js
```
async index(){
  const { ctx } = this
  ctx.body = await ctx.service.user.getAll()
}
```
- 创建模型层：以mysql+sequelize为例演示数据持久化  
  1. 安装：`npm i --save egg-sequelize mysql2`
  2. 在`config/plugin.js`中引入`egg-sequelize`插件
  ```
  sequelize:{
    enable:true,
    package:'egg-sequelize'
  }
  ```
  3. 在`config/config.default.js`中编写sequelize配置
  ```
  sequelize: {
    dialect: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "admin",
    database: "test"
  }
  ```
  4. 编写User模型，./app/model/user.js
  ```
  module.exports = app => {
    const {
      STRING
    } = app.Sequelize;
    const User = app.model.define(
      "user", {
        name: STRING(30)
      }, {
        timestamps: false
      }
    );
    return User;
  };
  ```
  5. 服务中或者控制器中调用：ctx.model.User或app.model.User
  ```
  class UserService extends Service {
    async getAll() {
      return await this.ctx.model.User.findAll()
    }
  }
  ```
需要同步数据库
https://eggjs.org/zh-cn/tutorials/sequelize.html
```
npm i --save-dev sequelize-cli
```
# 实现MVC分层架构
***
- 路由处理
  - 路由定义：
    1. 新建routes/index.js，默认index.js没有前缀
    ```
    module.exports = {
      'get /': async ctx => {
        ctx.body = '首页'
      },
      'get /detail': ctx => {
        ctx.body = '详情页面'
      }
    }
    ```
    2. 新建routes/user.js路由前缀是/user
    ```
    module.exports = {
      "get /": async ctx => {
        ctx.body = "用户首页";
      },
      "get /info": ctx => {
        ctx.body = "用户详情页面";
      }
    };
    ```
    3. 路由加载器，新建kkb-loader.js
    ```
    const fs = require("fs");
    const path = require("path");
    const Router = require("koa-router");
    // 读取指定目录下文件
    function load(dir, cb) {
      const url = path.resolve(__dirname, dir);
      const files = fs.readdirSync(url);
      files.forEach(filename => {
        filename = filename.replace(".js", "");
        const file = require(url + "/" + filename);
        cb(filename, file);
      });
    }

    function initRouter() {
      const router = new Router();
      load("routes", (filename, routes) => {
        const prefix = filename === "index" ? "" : `/${filename}`;
        Object.keys(routes).forEach(key => {
          const [method, path] = key.split(" ");
          console.log(
            `正在映射地址：${method.toLocaleUpperCase()} ${prefix}${path}`
          );
          router[method](prefix + path, routes[key]);
        });
      });
      return router;
    }
    module.exports = {
      initRouter
    };
    ```
    4. 测试，引入kkb-loader.js
    ```
    const koa = require('koa')
    const {
      initRouter
    } = require('./kkb-loader')
    app.use(initRouter().routes());
    ```
    5. 封装，创建kkb.js
    ```
    const koa = require("koa");
    const {
      initRouter
    } = require("./kkb-loader");
    class kkb {
      constructor(conf) {
        this.$app = new koa(conf);
        this.$router = initRouter();
        this.$app.use(this.$router.routes());
      }
      start(port) {
        this.$app.listen(port, () => {
          console.log("服务器启动成功，端口" + port);
        });
      }
    }
    module.exports = kkb;
    ```
    6. 修改app.js
    ```
    const kkb = require("./kkb");
    const app = new kkb();
    app.start(3000);
    ```
- 控制器：抽取route中业务逻辑至controller
  - 约定：controller文件夹下面存放业务逻辑代码，框架自动加载并集中暴露
  - 新建controller/home.js
  ```
  module.exports = {
    index: async ctx => {
    ctx.body = "首页";
  },
    detail: ctx => {
    ctx.body = "详情页面";
  }
  }
  ```
  - 修改路由声明，routes/index.js
  ```
  // 需要传递kkb实例并访问其$ctrl中暴露的控  制器
  module.exports = app => ({
    "get /": app.$ctrl.home.index,
    "get /detail": app.$ctrl.home.detail
  });
  ```
  - 加载控制器，更新kkb-loader.js
  ```
  function initController() {
    const controllers = {};
    // 读取控制器目录
    load("controller", (filename, controller) => {
      // 添加路由
      controllers[filename] = controller;
    });
    return controllers;
  }
  module.exports = {
    initController
  };
  ```
  - 初始化控制器，kkb.js
  ```
  const {
    initController
  } = require("./kkb-loader");
  class kkb {
    constructor(conf) {
      //...
      this.$ctrl = initController(); // 先初始化控制器，路由对它有依赖
      this.$router = initRouter(this); // 将kkb实例传进去
      //...
    }
  }
  ```
  - 修改路由初始化逻辑，能够处理函数形式的声明，kkb-loader.js
  ```
  function initRouter(app) { // 添加一个参数
    load("routes", (filename, routes) => {
      // ...
      // 判断路由类型，若为函数需传递app进去
      routes = typeof routes == "function" ? routes(app) : routes;
      // ...
    });
  }
  ```
- 服务：抽离通用逻辑至service文件夹，利于复用
  - 新建service/user.js
  ```
  const delay = (data, tick) => new Promise(resolve => {
    setTimeout(() => {
      resolve(data)
    }, tick)
  })
  // 可复用的服务 一个同步，一个异步
  module.exports = {
    getName() {
      return delay('jerry', 1000)
    },
    getAge() {
      return 20
    }
  };
  ```
  - 加载service
  ```
  //kkb-loader.js
  function initService() {
    const services = {};
    // 读取控制器目录
    load("service", (filename, service) => {
      // 添加路由
      services[filename] = service;
    });
    return services;
  }
  module.exports = {
    initService
  };
  // kkb.js
  this.$service = initService();
  ```
  - 挂载和使用service
  ```
  // kkb-loader.js
  function initRouter(app) {
    // ...
    router[method](prefix + path, async ctx => { // 传入ctx
      app.ctx = ctx;
      await routes[key](app);
    });
    //...
  }
  ```
  - 更新路由
  ```
  // routes/user.js
  module.exports = {
    "get /": async (app) => {
      const name = await app.$service.user.getName();
      app.ctx.body = "用户:" + name;
    },
    "get /info": app => {
      app.ctx.body = "用户年龄：" + app.$service.user.getAge();
    }
  };
  // routes/index.js
  module.exports = app => ({
    "get /": app.$ctrl.home.index,
    "get /detail": app.$ctrl.home.detail
  });
  ```
- 定时任务
  - 使用Node-schedule来管理定时任务
  ```
  npm i node-schedule --save
  ```
  - 约定：schedule目录，存放定时任务，使用crontab格式来启动定时
  ```
  //log.js
  module.exports = {
    interval: '*/3 * * * * *',
    handler() {
      console.log('定时任务 嘿嘿 三秒执行一次' + new Date())
    }
  }
  // user.js
  module.exports = {
      interval: '30 * * * * *',
      handler() {
        console.log('定时任务 嘿嘿 每分钟第30秒执行一次' + new Date())
      }
  }
  ```
  - 新增loadSchedule函数，kkb-loader.js
  ```
  const schedule = require("node-schedule");

  function initSchedule() {
    // 读取控制器目录
    load("schedule", (filename, scheduleConfig) => {
      schedule.scheduleJob(scheduleConfig.interval, scheduleConfig.handler);
    });
  }
  module.exports = {
    initRouter,
    initController,
    initService,
    initSchedule
  };
  // kkb.js
  const {
    initSchedule
  } = require("./kkb-loader");
  class kkb {
    constructor(conf) {
      initSchedule();
    }
  }
  ```
![](https://upload-images.jianshu.io/upload_images/15424855-bc1a751f4d6dfc43.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 数据库集成
  - 集成sequelize:`npm i sequelize mysql2 --save`
  - 配置sequelize连接配置项，config.js
  ```
  module.exports = {
    db: {
      dialect: 'mysql',
      host: 'localhost',
      database: 'test',
      username: 'root',
      password: 'admin'
    }
  }
  ```
  - 新增loadConfig，kkb-loader.js
  ```
  const Sequelize = require("sequelize");

  function loadConfig(app) {
    load("config", (filename, conf) => {
      if (conf.db) {
        app.$db = new Sequelize(conf.db);
      }
    });
  }
  module.exports = {
    loadConfig
  };
  ```
  - 新建数据库模型，modul/user.js
  ```
  const {
    STRING
  } = require("sequelize");
  module.exports = {
    schema: {
      name: STRING(30)
    },
    options: {
      timestamps: false
    }
  };
  ```
  - loadModel和loadConfig初始化，kkb-loader.js
  ```
  function loadConfig(app) {
    load("config", (filename, conf) => {
      if (conf.db) {
        app.$db = new Sequelize(conf.db);
        // 加载模型
        app.$model = {};
        load("model", (filename, {
          schema,
          options
        }) => {
          app.$model[filename] = app.$db.define(filename, schema, options);
        });
        app.$db.sync();
      }
    });
  }
  ```
  - 在controller中使用$db
  ```
  index: async app => { // app已传递
    app.ctx.body = await app.$model.user.findAll()
  }
  ```
  - 在service中使用$db
  ```
  // 修改service结构，service/user.js
  module.exports = app => ({ // 变为函数，传入app
    //...
  });
  // 修改kkb-loader.js
  services[filename] = service(app); // 服务变为函数，传入app
  // 使用方式和controller相同
  ```
- 中间件
  - 规定koa中间件放入middleware文件夹
  - 编写一个请求记录中间件，./middleware/logger.js
  ```
  module.exports = async (ctx, next) => {
    console.log(ctx.method + " " + ctx.path);
    const start = new Date();
    await next();
    const duration = new Date() - start;
    console.log(
      ctx.method + " " + ctx.path + " " + ctx.status + " " + duration + "ms"
    );
  };
  ```
  - 配置中间件，./config/config.js
  ```
  module.exports = {
    db:{...},
    middleware: ['logger'] // 以数组形式，保证执行顺序
  }
  ```
  - 加载中间件，kkb-loader.js
  ```
  function loadConfig(app) {
    load("config", (filename, conf) => {
      // 如果有middleware选项，则按其规定循序应用中间件
      if (conf.middleware) {
        conf.middleware.forEach(mid => {
          const midPath = path.resolve(__dirname, "middleware", mid);
          app.$app.use(require(midPath));
        });
      }
    });
  }
  ```
  - 调用kkb.js
  ```
  class kkb {
    constructor(conf) {
      this.$app = new koa(conf);
      //先加载配置项
      loadConfig(this);
      //...
    }
  ```