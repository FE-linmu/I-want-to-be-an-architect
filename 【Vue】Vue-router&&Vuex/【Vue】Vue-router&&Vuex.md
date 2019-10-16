# 引言

---

此篇文章主要涉及以下内容，其中重点为`vue-router`多页面管理和`vuex`数据管理。

1. `vue-router`基础配置
2. 路由传参
3. 子路由
4. 路由重定向
5. 路由守卫
6. `vuex`数据流
7. `store`
8. `state`
9. `mutation`
10. `action`

# 学习资源

---

[vue-router](https://router.vuejs.org/zh/guide/)
[vuex](https://vuex.vuejs.org/zh/guide/)

# 起步

---

`Vue Router`是`Vue.js`官方的路由管理器，它和`Vue.js`的核心深度集成，让构建单页面应用变得易如反掌，包含功能有：

1. 嵌套的路由/视图表
2. 模块化的、基于组件的路由配置
3. 路由参数
4. 基于`Vue.js`过渡系统的视图过渡效果
5. 细粒度的导航控制
6. 带有自动激活的`css class`的链接
7. `html5`历史模式或`hash`模式

- 新建项目`vue create vue-router-vuex`
- 安装`vue-router` `npm install vue-router -S or vue add router`
- `npm run serve`

# 多页面体验

---

- 新建`route.js`
  新建两个测试组件

```
<template>
  <div>页面1</div>
</template>
<script>
export default {

}
</script>
```

```
<template>
  <div>页面2</div>
</template>
<script>
export default {

}
</script>
```

```
import Vue from 'vue'
import VueRouter from 'vue-route'
import Page1 from './components/Page1'
import Page2 from './components/Page2'

Vue.use(VueRouter)

export default new VueRouter({
  routes:[
    {path:'/page1',component:Page1},
    {path:'/page2',component:Page2}
  ]
})
```

- main.js

```
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './routes'
Vue.config.productionTip=false  // 生产模式的消息不展示出来

Vue.use(VueRouter)
new Vue({
  router, // 名字必须是router
  render:h=>h(App)
}).$mount('#app')
```

- app.vue 使用 router-view 占位符

```
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name:'app'
}
</script>
```

访问`http://localhost:8080/#/page1`和`http://localhost:8080/#/page2`即可看到不同的组件内容

# 导航

---

使用`App.vue`中，使用`router-link`作为导航按钮

```
  <div id="app">
    // to必须得有
    <router-link to="/page1">Page1</router-link>
    <router-link to="/page2">Page2</router-link>
  </div>
```

# history 模式

---

默认是 `hash`模式，`url`使用#后面定位路由，对`seo`不利，设置`history`，就可以使用普通的 url 模式

```
// router.js

export default new VueRouter({
  mode:"history",
  routes:[
    {path:'/page1',component:Page1},
    {path:'/page2',component:Page2}
  ]
})
```

`url`就变成了`http://localhost:8080/page1`

# 重定向

---

```
{
  path: '/',
  redirect: '/page1'
}
```

# 路由命名

---

可以给路由设置 name，方便 router-link 跳转

```
<router-link :to="{name:'home',params:{userId:123}}"></router-link>
```

首页=》搜索列表页面=》详情页面
/index
/list?test=xxx
/shuma/detail/123

# 动态路由

---

路由可以携带一些参数，使用`this.$router`获取

```
{path:'/page3/:id',component:Page3}
```

```
<template>
  <div>
    详情页面
  </div>
</template>
<script>
export default {
  created(){
    console.log(this.$route)
  }
}
</script>
```

![](https://upload-images.jianshu.io/upload_images/15424855-08e893e0fa981594.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 参数属性传递

---

设置`props`属性，获取路由的变量，就和普通的属性传递没什么区别

```
{path:'/page3/:id',props:true,component:Page3}
```

```
<template>
  <div>
    <p>详情页面</p>
    <div>
      hi{id}
    </div>
  </div>
</template>
<script>
export default {
  created () {
    cosole.log(this.$route)
  },
  props: ['id']
}
</script>
```

# 嵌套路由

---

子路由的概念，比如页面内部的导航复用

```
export default new VueRouter({
  mode: "history",
  routes: [{
      path: '/login',
      component: Login
    },
    {
      path: '/dashboard',
      component: DashBoard,
      children: [{
          path: 'page1',
          component: Page1
        },
        {
          path: 'page2',
          component: Page2
        },
        {
          path: 'page3/:id',
          props: true,
          component: Page3
        }
      ]
    }
  ]
})
```

app.vue

```
<template>
  <div id="app">
    <router-link></router-link>
    <hr>
    <div>test</div>
  </div>
</template>
<script>
export default {
  name:'app'
}
</script>
```

dashboard.vue

```
<template>
  <div>
    <div>
      <router-link to="/dashboard/page1">Page1</router-link>
      <router-link to="/dashboard/page2">Page2</router-link>
      <router-link to="/login">login</router-link>
    </div>
    <hr>
    <router-view></router-view>
  </div>
</template>
<script>
export default {

}
</script>
```

page1.vue

```
<template>
  <div>
    <p>页面1</p>
    <div>
      <router-link to="page3/react">react</router-link>
      <router-link to="page3/vue">vue</router-link>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
```

# 命名视图

---

一个组件内部有多个`router-view`怎么来分配组件呢？比如三栏布局，顶部栏点击按钮，左侧栏的菜单变化

```
home.vue
<template>
  <div>
    <div id="app">
      <router-view></router-view>
      <router-view name="a"></router-view>
    </div>
  </div>
</template>

routes:[
  {
    path:'/home',
    compotents:{
      default:Home,
      a:List
    }
  }
]
```

# 导航守卫

---

## 全局守卫

- 每次路由跳转都会被触发

```
router.beforeEach((to,from,next)=>{
  // 全局前置守卫，当一个导航触发时，全局前置守卫按照创建顺序调用
  // 数据校验时，非常有用 if(to.fullPath==='/home) next('/login')
  console.log('before each')
  next();
})

router.beforeResolve((to,from,next)=>{
  // 全局解析守卫，2.5.0新增，这和router.beforeEach类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用
  console.log('before resolve')
  next();
})

router.afterEach((to,from)=>{
  // 全局后置钩子
  console.log('after each')
})
```

`beforeEach`所有路由跳转前执行，`next`同意跳转，比如`login`执行 2 秒后跳转

```
routers.beforeEach((to,from,next)=>{
  console.log('beforeEach')
  console.log(to)
  if(to.path!=='/login'){
    next()
  }else{
    setTimeout(()=>{
      next()
    },2000)
  }
})

routers.afterEach((to,from)=>{
  console.log('afterEach')
})
```

## 路由独享守卫

- 写在配置里
  你可以在路由配置上直接定义`beforeEnter`守卫

```
const router=new VueRouter({
  routes:[
    {
      path:'/foo',
      component:Foo,
      // 在进入这个路由之前调用
      beforeEnter:(to,from,next)=>{
        // ...
      }
    }
  ]
})
```

## 组件内的守卫

最后，你可以在路由组件内直接定义以下路由导航守卫

```
const Foo={
  template:`...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被confim前调用
    // 不能获取组件实例’this‘
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate(to,from,next){
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id,在/foo/1和/foo/2之间跳转的时候
    // 由于会渲染同样的Foo组件，因此组件实例会被复用，而这个钩子就会在这个情况下被调用
    // 可以访问组件实例’this'
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例'this'
    // 通常用来禁止用户在还未保存修改前突然离开，该导航可以通过next(false)来取消
  }
}
```

1. 导航被触发。
2. 调用全局的`beforeEach`守卫。
3. 在重用的组件重调用`beforeRouterUpdate`守卫。
4. 在路由配置里调用`beforeEnter`。
5. 在被激活的组件里调用`beforeRouteEnter`。
6. 调用全局的`beforeResolve`守卫（2.5+）。
7. 导航被确认。
8. 调用全局的`afterEach`钩子。
9. 触发`DOM`更新。

# 异步组件

---

路由懒加载`vue`中配合`webpack`非常简单

```
{
  path: '/login',
  component: () => import('./components/Login')
}
```

# Vuex 数据管理

---

有几个不相干的组件，想共享一些数据怎么办呢？
`npm i vuex -S`安装
`Vue add vuex`
核心概念：

- store
- state // 数据中心
- mutations // 操作数据
- Actions // 什么时候触发操作，执行动作，改变数据

# 状态管理模式

---

![](https://upload-images.jianshu.io/upload_images/15424855-b9b3de51c3742c7c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## store

---

新建 store.js

```
import Vuex from 'vuex'

export default new Vuex.Store({
  state: {
    count: 0
  }
})
```

入口

```
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import router from './routes'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuex)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

Page1.vue

```
export default{
  computed:{
    count(){
      return this.$store.state.count;
    }
  }
}
```

## Mutation

---

直接修改 state 的数据也可以，但是建议使用单向数据流的模式，使用 Mutation 来修改数据。

- 直接改

```
created() {
  setInterval(()=>{
    this.$store.state.count++
  },500)
},
```

使用`strict`配置，可以禁用这种模式
![](https://upload-images.jianshu.io/upload_images/15424855-ab3f382cbd7f862d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 使用`commit`调用`Mutation`来修改数据

```
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: [
    increment(state) {
      state.count++
    }
  ],
  strict: true
})
```

```
export default{
  created() {
    setInterval(()=>{
      this.$store.commit('increment')
    },500)
  },
  computed:{
    count(){
      return this.$store.state.count;
    }
  }
}
```

## getters

---

有时候我们需要从`store`中的`state`派生出一些状态，我们可以理解为`vuex`中数据的`computed`功能
store.js

```
getters:{
  money:state=>`￥${state.count*1000}`
}
```

Page1.vue

```
computed:{
  money(){
    return this.$store.getters.money;
  }
}
```

## Action

---

`Mutation`必须是同步的，`Action`是异步的`Mutation`
store.js

```
actions:{
  incrementAsync({commit}){
    setTimeout(()=>{
      commit('increment')
    },1000)
  }
},

this.$store.dispatch('incrementAsync')
```

传递参数

```
this.$store.dispatch('incrementAsync', {
  amount: 10
})

actions: {
    incrementAsync(store, args) {
      setTimeout(() => {
        store.commit('incrementNum', args)
      }, 1000)
    }
  },
  // 这是mutation里面的方法
  incrementNum(state, args) {
    state.count += args.amount
  }
```

## mapState

---

为了更方便的使用`api`，当一个组件需要获取多个状态时，将这些状态都声明为计算属性会有些重复和冗余，为了解决这个问题，我们可以使用`mapState`辅助函数帮助我们生成计算属性。

```
...mapState({
  count:state=>state.count
})
```

## mapActions

---

方便快捷的使用 action

```
methods:{
  ...mapActions(['incrementAsync']),
  ...mapMutations(['increment']),
}
```

this.\$store.dispatch 可以变为

```
this.incrementAsync({amount:10})
```

## mapMutions

---

同理

```
...mapMutations(['increment'])
this.increment()
```
