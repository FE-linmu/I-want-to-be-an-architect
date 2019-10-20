# 引言
***
此篇文章主要涉及以下内容：
1. 数据和状态管理实践
2. `vuex`模块化
3. `vue`动画设计(项目中有购物时，跳的小球动画，很值得学习)
4. 全局组件实现与原理
5. 全局回退管理
# 学习资源
***
- [TarBar导航栏使用](https://didi.github.io/cube-ui/#/zh-CN/docs/tab-bar)
- [轮播组件使用](https://didi.github.io/cube-ui/#/zh-CN/docs/slide)
- [vuex模块化](https://vuex.vuejs.org/zh/guide/modules.html)
- [vue动画设计](https://cn.vuejs.org/v2/guide/transitions.html)
- 动态全局组件创建
- [vue渲染函数原理](https://cn.vuejs.org/v2/guide/render-function.html)
- [vue的$mount函数](https://cn.vuejs.org/v2/api/#vm-mount)
# 轮播图和商品列表
***
- mock数据，vue.config.js
    - 分析/api/goods接口数据结构
- goods服务，service/goods.js
    ```
     import axios from 'axios'

     export default {
        getGoodsInfo(){
            return axios.get('/api/goods')
            .then(res=>{
                const {code, data: goodsInfo, slider, keys} = res.data;
                // 数据处理
                if (code) {
                    return {goodsInfo, slider, keys}
                } else {
                    return null;
                }
            })
        }
    }
    ```
- 定义actions，store.js
    ```
    import gs from "@/service/goods";

    export default {
      state: {
        slider: [],
        keys: [],
        goodsInfo: {}
      },
      mutations: {
        setGoodsInfo(state, { slider, keys, goodsInfo }) {
          state.slider = slider;
          state.keys = keys;
          state.goodsInfo = goodsInfo;
        }
      },
      getters: { // 添加一个goods属性，转换对象形式为数组形式便于循环渲染
        goods: state => {
          return state.keys
            .map(key => state.goodsInfo[key])
            .reduce((prev, next) => prev.concat(next), []);
        }
      },
      actions: {
        getGoods({ state, commit }) {
            if (!state.keys.length) {
                // 没有数据采去获取
                gs.getGoodsInfo().then(goodsInfo => {
                    commit('setGoodsInfo', goodsInfo)
                })
            }
        }
      }
    };
    ```
- 轮播图、商品列表模板，Home.vue
    ```
    <template>
      <div class="home">
        <!-- 轮播图 -->
        <cube-slide :data="slider" :interval="5000">
          <cube-slide-item v-for="(item,index) in slider" :key="index">
            <router-link :to="`/detail/${item.id}`">
              <img class="slider" :src="item.img">
            </router-link>
          </cube-slide-item>
        </cube-slide>

        <!-- 商品列表 -->
        <good-list :data="goods"></good-list>
      </div>
    </template>
    <script>
    import GoodList from "@/components/GoodList.vue";
    export default {
      name: "home",
      components: {
        GoodList,
      }
    };
    </script>
    ```
- 轮播图、商品列表数据获取， Home.vue
    ```
      created() {
        this.getGoods(); // 数据初始化
      },
      computed: {
        ...mapState({ slider: state => state.goods.slider }),
        ...mapGetters(["goods"])
      },
      methods: {
        ...mapActions(["getGoods"]),
    ```
# 购物车
- 购物车状态，store.js
    ```
    export default {
      state: {
        // 购物车初始状态
        cart: JSON.parse(localStorage.getItem("cart")) || []
      },
      mutations: {
        addcart(state, item) {
          // 添加商品至购物车
          const good = state.cart.find(v => v.title == item.title);
          if (good) {
            good.cartCount += 1;
          } else {
            state.cart.push({
              ...item,
              cartCount: 1
            });
          }
        },
        cartremove(state, index) {
          // count-1
          if (state.cart[index].cartCount > 1) {
            state.cart[index].cartCount -= 1;
          }
        },
        cartadd(state, index) {
          // count+1
          state.cart[index].cartCount += 1;
        }
      },
      getters: {
        cartTotal: state => {
          // 商品总数
          let num = 0;
          state.cart.forEach(v => {
            num += v.cartCount;
          });
          return num;
        },
        total: state => {
          // 总价
          return state.cart.reduce(
            (total, item) => total + item.cartCount * item.price,
            0
          );
        }
      }
    };
    ```
- 购物车显示，Cart.vue
- 在导航栏里显示购物数量，App.vue
    ```
    import {mapGetters} from 'vuex'

    computed:{
  ...mapGetters(['cartTotal'])
    }
    ```
    ```
    <cube-tab-bar v-model="selectLabel" :data="tabs" @change="changeHandler">
      <cube-tab v-for="(item, index) in tabs" 
                :icon="item.icon" :label="item.value" :key="index">
        <div>{{item.label}}</div>
        <span class="badge" v-if="item.label=='Cart'">{{cartTotal}}</span>
      </cube-tab>
    </cube-tab-bar>
    ```
- vuex模块化
    - 创建store目录，创建user.js/cart.js/goods.js
    ```
    // goods.js
    import gs from "@/service/goods";

    export default {
      state: {
        slider: [],
        keys: [],
        goodsInfo: {}
      },
      mutations: {
        setGoodsInfo(state, { slider, keys, goodsInfo }) {
          state.slider = slider;
          state.keys = keys;
          state.goodsInfo = goodsInfo;
        }
      },
      getters: { // 添加一个goods属性，转换对象形式为数组形式便于循环渲染
        goods: state => {
          return state.keys
            .map(key => state.goodsInfo[key])
            .reduce((prev, next) => prev.concat(next), []);
        }
      },
      actions: {
        getGoods({ state, commit }) {
            if (!state.keys.length) {
                // 没有数据采去获取
                gs.getGoodsInfo().then(goodsInfo => {
                    commit('setGoodsInfo', goodsInfo)
                })
            }
        }
      }
    };
    // cart.js
   export default {
      state: {
        // 购物车初始状态
        cart: JSON.parse(localStorage.getItem("cart")) || []
      },
      mutations: {
        addcart(state, item) {
          // 添加商品至购物车
          const good = state.cart.find(v => v.title == item.title);
          if (good) {
            good.cartCount += 1;
          } else {
            state.cart.push({
              ...item,
              cartCount: 1
            });
          }
        },
        cartremove(state, index) {
          // count-1
          if (state.cart[index].cartCount > 1) {
            state.cart[index].cartCount -= 1;
          }
        },
        cartadd(state, index) {
          // count+1
          state.cart[index].cartCount += 1;
        }
      },
      getters: {
        cartTotal: state => {
          // 商品总数
          let num = 0;
          state.cart.forEach(v => {
            num += v.cartCount;
          });
          return num;
        },
        total: state => {
          // 总价
          return state.cart.reduce(
            (total, item) => total + item.cartCount * item.price,
            0
          );
        }
      }
    };
    ```
    - 将store.js移进去，重命名为index.js
    ```
    import Vue from "vue";
    import Vuex from "vuex";
    import user from './user'
    import goods from './goods'
    import cart from './cart'

    Vue.use(Vuex);

    export default new Vuex.Store({
    modules:{
      user, goods, cart
    }
    });
    ```
    - 代码中只有state映射需要修改
    ```
    // home.vue
    ...mapState({
      slider:state=>state.goods.slider
    })
    // cart.vue
    ...mapState({cart:state=>state.cart.cart})
    ```
# 动画设计
***
- [vue动画](https://cn.vuejs.org/v2/guide/transitions.html)
- 页面切换动画，App.vue
- 添加购物车动画
    - 创建购物车动画组件，CartAnim.vue
    ```
    <template>
      <div class="ball-wrap">
        <transition @before-enter="beforeEnter"
                    @enter="enter"
                    @afterEnter="afterEnter">
          <div class="ball"
              v-show="show">
            <div class="inner">
              <div class="cubeic-add"></div>
            </div>
          </div>
        </transition>
      </div>
    </template>
    <script>
    export default {
      name: "cartAnim",
      data () {
        return {
          show: false
        }
      },
      methods: {
        start (el) { // 启动动画接口，传递点击按钮元素  
          this.el = el;
          // 使.ball显示，激活动画钩子
          this.show = true;
        },
        beforeEnter (el) {
          // 把小球移动到点击的dom元素所在位置
          const rect = this.el.getBoundingClientRect();
          // 转换为用于绝对定位的坐标
          const x = rect.left - window.innerWidth / 2;
          const y = -(window.innerHeight - rect.top - 10 - 20);
          // ball只移动y
          el.style.transform = `translate3d(0,${y}px,0)`;
          // inner只移动x
          const inner = el.querySelector('.inner');
          inner.style.transform = `translate3d(${x}px,0,0)`;
        },
        enter (el, done) {
          // 获取offsetHeight就会重绘
          document.body.offsetHeight;
          // 指定动画结束位置
          el.style.transform = `translate3d(0,0,0)`;
          const inner = el.querySelector('.inner');
          inner.style.transform = `translate3d(0,0,0)`;
          el.addEventListener('transitionend', done)
        },
        afterEnter (el) {
          // 动画结束，开始清理工作
          this.show = false;
          el.style.display = 'none';
          this.$emit('transitionend');
        }
      }
    }
    </script>
    <style lang="stylus" scoped>
    .ball-wrap {
      .ball {
        position: fixed;
        left: 50%;
        bottom: 10px;
        z-index: 100000;
        color: red;
        transition: all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41);

        .inner {
          width: 16px;
          height: 16px;
          transition: all 0.5s linear;

          .cubeic-add {
            font-size: 22px;
          }
        }
      }
    }
    </style>
    ```
![](https://upload-images.jianshu.io/upload_images/15424855-b6dec8c8d3250030.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

   - 使用动画，Home.vue
   ```
    <good-list @cartanim='$refs.ca.start($event)'></good-list>
    <cart-anim ref='ca'></cart-anim>
    import CartAnim from '@/componets/CartAnim.vue'
    components: { CartAnim }
   ```
   - 触发动画，GoodList.vue
   ```
    <i class='cubeic-add'
       @click.stop.prevent="addCart($event,item)"></i>
    addCart (e, item) {  // 需要传递事件目标
      this.$store.commit("addcart", item);
      // 触发动画时间
      this.$emit('startcartanim', e.target)
    }
   ```
   > 动画有两个问题：
     1. 使用比较麻烦
     2. 不能生成多个动画实例
# 动态全局组件设计与实现
***
- 使用cube-ui的[create-api](https://didi.github.io/cube-ui/#/zh-CN/docs/create-api)
    - 注册
    ```
    import {createAPI} from 'cube-ui'
    import CartAnim from '@/components/CartAnim'
    
    createAPI(Vue,BallAnim,['transitionend'])
    ```
    - 调用api，Home.vue
    ```
    <good-list :data='goods' @startcartanim='startCartAnim'></good-list>
    methods:{
      startCartAnim(el){
        const anim=this.$createCartAnim({
          onTransitionend(){
            anim.remove();
          }
        });
        anim.start(el);
      }
    }
    ```
    > create-api的原理是动态创建组件并全局挂载至body中，下面我们自己实现一下

    - 组件动态创建并挂载的具体实现
        - 定义动态创建函数：./utils/create.js
        ```
        import Vue from 'vue';

        // 创建函数接收要创建组件定义
        function create(Component, props) {
          // 创建一个Vue新实例
          const instance = new Vue({
            render(h) {
              // render函数将传入组件配置对象转换为虚拟dom
              console.log(h(Component, {
                props
              }));
              return h(Component, {
                props
              });
            }
          }).$mount(); // 执行挂载函数，但未指定挂载目标，表示只执行初始化、编译等工作
          // 将生成dom元素追加至body
          document.body.appendChild(instance.$el)
          // 给组件实例添加销毁方法
          const comp = instance.$children[0];
          comp.remove = () => {
            document.body.removeChild(instance.$el);
            instance.$destroy();
          };
          return comp;
        }

        // 暴露调用接口
        export default create;
        ```
        - 挂载到vue实例上，main.js
        ```
        import create from '@/utils/create'
        Vue.prototype.$create=create;
        ```
        - 调用，Home.vue
        ```
        startCartAnim(el){
          const anim=this.$create(CartAnim);
          anim.start(el);
          anim.$on('transitionend',anim.remove);
        }
        ```
        - 还可以传递属性到组件，增加组件可用性
        ```
        // Home.vue
        const anim=this.$create(CartAnim,{
          pos:{left:'45%',bottom:'10px'}
        });
        // CartAnim.vue
        <div class='ball' v-show='show' :style='pos'>
        props:['pos']
        ```
# 页头组件
***
- 组件定义，Header.vue
    ```
    <template>
      <div class="header">
        <h1>{{title}}</h1>
        <i v-if="$routerHistory.canBack()" @click="back" class="cubeic-back"></i>
        <div class="extend">
          <slot></slot>
        </div>
      </div>
    </template>

    <script>
    export default {
      props: {
        title: {
          type: String,
          default: "",
          required: true
        },
        showback: {
          type: Boolean,
          default: false
        }
      },
      methods: {
        back() {
          this.$router.goBack();
        }
      }
    };
    </script>
    <style lang="stylus" scoped>
    .header {
      position: relative;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background: #edf0f4;

      .cubeic-back {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 15px;
        color: #fc915b;
      }

      .extend {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 15px;
        color: #fc915b;
      }
    }
    </style>
    ```
- 使用，Home.vue
    ```
    <k-header title="XXX">
      <i class="cubeic-tag"></i>
    </k-header>
    
    import KHeader from '@/components/Header.vue';
    components:{
      KHeader
    }
    ```
- 返回按钮状态自动判断：history.length是不可靠的，它既包含了vue app路由记录，也包括其他页面的。可以添加一个自定义的历史记录管理栈，创建./utils/history.js
    ```
    const History = {
      _history: [], // 历史记录堆栈
      install(vue) {
        // vue插件要求的安装方法
        Object.defineProperty(Vue.prototype, "$routerHistory", {
          get() {
            return History;
          }
        });
      },
      push(path) {
        // 入栈
        this._current += 1;
        this._history.push(path);
      },
      pop() {
        // 出栈
        this._current -= 1;
        return this._history.pop();
      },
      canBack() {
        return this._history.length > 1;
      }
    }
    export default History
    ```
- router.js中引入，添加一个后退方法并监听afterEach从而管理记录
    ```
    import History from './utils/history';
    import router from './【Vue】Vue项目实战2/vue-mart/src/router';

    Vue.use(History);

    router.prototype.goBack=function(){
      this.isBack=true;
      this.back();
    };

    router.afterEach((to,from)=>{
      if(router.isBack){
        History.pop();
        router.isBack=false;
        router.transitionName='route-back';
      }else{
        History.push(to.path);
        router.transitionName='route-forward';
      }
    })
    ```
- 使用，Header.vue
    ```
    <i v-if='$routerHistory.canBack()'></i>
    methods:{
      back(){this.$router.goBack()}
    }
    ```
- 后退动画，App.vue
    ```
    // 动态设置名称
    <transition :name='transitionName'>
      <router-view class='child-view'></router-view>
    </transition>
  watch: {
    // 动态设置动画方式
    this.transitionName = this.$router.transitionName
  },
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
    ```
