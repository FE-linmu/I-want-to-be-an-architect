import Vue from 'vue'
import Router from 'vue-router'
import pageB  from './views/pageB'
import Test from './views/Test'

//安装路由到vue
Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect : '/a'
  },
  {
    path: '/a/:id',
    name: 'pageA',
    beforeEnter: (to, from, next) => {
      console.log('before enter');
      next()
    },
    component : pageA
  },
  // {
  //   path: '/b/:id',
  //   props: true,
  //   component : pageB,
  //   children:[
  //     {
  //       path: 'test',
  //       component : Test
  //     }
  //   ]
  // }
]

export default new Router({
  mode: 'history',
  routes
})