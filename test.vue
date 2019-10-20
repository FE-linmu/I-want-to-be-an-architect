/* 展示模板 */
<template>
  <div id='app'>
    <transition :name='transitionName'>
      <router-view class='child-view'></router-view>
    </transition>
  </div>
</template>
<script>
import CartAnim from '@/componets/CartAnim.vue'
//导入组件
export default {
  name: 'App',
  components: { CartAnim },
  data () {
    return {
      transitionName: 'route-forward'
    }
  },
  watch: {
    // 动态设置动画方式
    this.transitionName = this.$router.transitionName
  },
  methods: {
    addCart (e, item) {  // 需要传递事件目标
      this.$store.commit("addcart", item);
      // 触发动画时间
      this.$emit('startcartanim', e.target)
    }
  }
}
</script>
<style>
/* 样式代码 */
#app {
  /* 页面滑动动画 */
  /* 入场前 */
  .route-forward-enter {
    transform: translate3d(-100%, 0, 0);
  }
  .route-back-enter {
    transform: translate3d(100%, 0, 0);
  }
  /* 出场后 */
  .route-forward-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .route-back-leave-to {
    transform: translate3d(-100%, 0, 0);
  }
  .route-forward-enter-active,
  .route-forward-leave-active,
  .route-back-enter-active,
  .route-back-leave-active {
    transition: transform 0.3s;
  }
}
</style>