import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  // if(to.fullPath === '/shoppingCart'){
    
  // } else{

  // }
  console.log('before each')

  next()
})
// 时间触发比前置钩子晚一些
router.beforeResolve((to, from, next) => {
  console.log('before resolve',to,from)
  next()
})
router.afterEach((to, from) => {
  console.log('after each')
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
