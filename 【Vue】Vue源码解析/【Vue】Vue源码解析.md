# 引言
***
此篇文章主要涉及以下内容：
1. `vue`工作机制
2. `vue`响应式的原理
3. 依赖收集与追踪
4. 编译`compile`
# 为什么要懂原理
***
编程世界和武侠世界是比较像的，每一个入门的程序员，都幻想自己有朝一日，神功大成，青衣长剑，救民于水火，但其实大部分人一开始的学习方式就错了，导致一直无法进入到高手的行列，究其原因，就是过于看中招式、武器，而忽略了内功的修炼，所以任你慕容复有琅环玉洞的百家武学，还是被我乔峰一招制敌，这就是内功差距。

武学之道，切勿贪多嚼不烂，博而不精不如一招鲜吃遍天，编程亦是如此。

源码，就是内力修炼的捷径。
# Vue工作机制
***
## 初始化
在`new Vue()`之后，Vue会调用进行初始化，会初始化生命周期、事件、`props`、`methods`、`data`、`computed`和`watch`等。其中最重要的是通过`Object.defineProperty`设置`setter`与`getter`，用来实现**响应式**与**依赖收集**。

**因为浏览器的瓶颈是在页面渲染方面，vue的核心思想是减少页面渲染的次数及数量。**

初始化之后调用`$mount`挂载组件。
![vue工作机制](https://upload-images.jianshu.io/upload_images/15424855-38ae26d3a0a631fa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![简化版](https://upload-images.jianshu.io/upload_images/15424855-ad77e5295698569b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## 编译
编译模块分为三个阶段，主要是解析和生成两个阶段，优化阶段是次要的。
1. parse （解析）
- 使用正则解析`template`中的vue的指令（`v-xxx`）变量等非正常`HTML`的内容，形成语法树`AST`。
2. optimize（优化）
 - 标记一些静态节点，用作后面的性能优化，在diff的时候直接略过。
3. generate（生成）
- 把第一部生成的`AST`转化为渲染函数`render function`。
## 响应式
**响应式是vue最核心的内容。**
`getter`和`setter`看稍后的代码演示，初始化的时候通过`defineProperty`进行绑定，设置通知的机制，当编译生成的渲染函数被实际渲染的时候，会触发`getter`进行依赖收集，在数据变化的时候，触发`setter`进行更新。
## 虚拟dom
`Virtual DOM`是`react`首创，`Vue2`开始支持，就是用`JavaScript`对象来描述`dom`结构，数据修改的时候，我们先修改虚拟`dom`中的数据，然后数组做`diff`，最后再汇总所有的`diff`，力求做最少的`dom`操作，毕竟`js`的对比很快，而真实的`dom`操作太慢。
```
// vdom
{
  tag:'div',
  props:{
    name:'虚拟dom的名字',
    style:{color:red},
    onClick:xxx
  },
  children:[
    {
      tag:'a',
      text:'click me'
    }
  ]
}
```
```
// js
<div name="虚拟dom的名字" style="color:red" @click="xxx">
  <a>
    click me
  </a>
</div>
```
## 更新视图
数据修改触发`setter`，然后监听器会通知进行修改，通过对比两个`dom`数，得到改变的地方，就是`patch`，然后只需要把这些差异修改即可。

接下来是实战部分：
## Vue2响应式的原理：defineProperty
***
**数据绑定的原理：**`vue`利用`es5`的`defineProperty`这个属性，将`data`里面的数据每个都定义了一个`setter`和`getter`，这样我们就可以监听属性的变化，当属性变化的时候，我们就可以通知那些需要更新的地方进行更新。
```
// 以下仅实现了数据绑定部分，响应到组件部分见后面解析
class LVue{
  constructor(options){
    this.$options=options;
    //数据响应化
    this.$data=options.data;
    this.observe(this.$data);
  }
  observe(value){
    // 对传参进行判断
    if(!value||typeof value!=="object"){
      return;
    }
    // 遍历该对象
    Object.keys(value).forEach(key=>{
      this.defineReaction(value,key,value[key]);
    });
  }
  // 数据响应化
  defineReactive(obj,key,val){
    this.observe(val); // 递归解决数据嵌套
    Object.defineProperty(obj,key,{
      enumerable:true, // 属性可枚举
      configurable:true, // 属性可被修改或删除
      get(){
        return val;
      },
      set(newVal){
        if(newVal===val) return;
        val=newVal;
        console.log(`${key}属性更新了：${val}`);
      }
    })
  }
}

let o=new LVue({
  data:{
    test:"I am test"
  }
});
o.$data.test="changed test"
```
[defineProperty使用方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
## 依赖收集与追踪
***
![简述图](https://upload-images.jianshu.io/upload_images/15424855-c0b31eca16a2b1b9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
new Vue({
  template:
    `<div>
        <span>{{text1}}</span>
        <span>{{text2}}</span>
     </div>`,
  data:{
    text1:'name1'
  },
  created(){
    this.text1='changed text1'
  }
})
```
`text1`被修改，所以视图更新，但是`text2`视图没用到，所以不需要更新，就需要我们的依赖收集。
```
// 依赖收集类Dep，用来管理watcher
class Dep{
  constructor(){
    // 存储所有的依赖（watcher），一个watcher对应一个属性text1 or text2
    this.deps=[]
  }
  // 在deps中添加一个监听器(watcher)对象
  addDep(dep){
    this.deps.push(dep)
  }
  // 通知所有监听器(watcher)去更新视图
  notify(){
    this.deps.forEach((dep)=>{
      dep.update()
    })
  }
}
// Watcher:实现前面的update方法
class Watcher{
  constructor(){
    // 在new一个监听器对象时将该对象赋值给Dep.target，在get中会用到
    // 将当前watcher实例指定到Dep静态属性target
    Dep.target=this
  }
  // 更新视图的方法
  update(){
    console.log('视图更新啦...')
  }
}
```
我们增加了一个`Dep`类的对象，用来收集`Watcher`对象。读数据的时候，会触发`reactiveGettter`函数把当前的`Watcher`对象（存放在`Dep.target`中）收集到`Dep`类中去。
写数据的时候，则会触发`reactiveSetter`方法，通知`Dep`类调用`notify`来触发所有`watcher`对象的`update`方法更新对应视图。
```
// 和前面响应式原理一起整合的代码
class LVue{
  constructor(options){
    this.$options=options;
    //数据响应化
    this.$data=options.data;
    this.observe(this.$data);

    // 模拟一下watcher观察者对象，这时候Dep.target会指向这个watcher对象
    new Watcher();
    // 在这里模拟render的过程，为了触发test属性的get函数
    console.log('模拟render，触发test的getter',this.$data.test);
  }
  observe(value){
    // 对传参进行判断
    if(!value||typeof value!=="object"){
      return;
    }
    // 遍历该对象
    Object.keys(value).forEach(key=>{
      this.defineReaction(value,key,value[key]);
    });
  }
  // 数据响应化
  defineReactive(obj,key,val){
    this.observe(val); // 递归解决数据嵌套
    
    const dep=new Dep();

    Object.defineProperty(obj,key,{
      enumerable:true, // 属性可枚举
      configurable:true, // 属性可被修改或删除
      get(){

        // 将Dep.target，即当前的watcher对象存入Dep的deps中
        Dep.target&&dep.addDep(Dep.target);

        return val;
      },
      set(newVal){
        if(newVal===val) return;

        // 在set的时候触发dep的notify来通知所有的watcher对象更新视图
        dep.notify()

        // val=newVal;
        // console.log(`${key}属性更新了：${val}`);
      }
    })
  }
}
```
## 编译compile
***
核心逻辑：获取`dom`，遍历`dom`，获取{{}}、`k-`和@开头的，设置响应式。
![简述图（图中的K-理解为V-即可）](https://upload-images.jianshu.io/upload_images/15424855-cb51bbf8781f0c39.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### 目标功能
```
// 目标功能
<body>
  <div id="app">
    <p>{{name}}</p>
    <p k-text="name"></p>
    <p>{{age}}</p>
    <p>
      {{doubleAge}}
    </p>
    <input type="text" k-model="name">
    <button @click="changeName">呵呵</button>
    <div k-html="html"></div>
  </div>
  <script src='./compile.js'></script>
  <script src='./k-vue.js'></script>
  
  <script>
    let k=new LVue({
      el:'#app',
      data:{
        name:'i am test',
        age:12,
        html:'<button>这是一个按钮</button>'
      },
      created(){
        console.log(‘开始啦’)
        setTimeout(()=>{
          this.name='我是蜗牛'
        },16)
      },
      methods:{
        changeName(){
          this.name='changed name',
          this.age=1,
          this.id='xxx'
          console.log(1,this)
        }
      }
    })
  </script>
</body>
```
### compile.js
```
// 用法 new Compile(el, vm)

class Compile {
  constructor(el, vm) {
    // 要遍历的宿主节点
    this.$el = document.querySelector(el);

    this.$vm = vm;

    // 编译
    if (this.$el) {
      // 转换内部内容为片段Fragment
      this.$fragment = this.node2Fragment(this.$el);
      // 执行编译
      this.compile(this.$fragment);
      // 将编译完的html结果追加至$el
      this.$el.appendChild(this.$fragment);
    }
  }

  // 将宿主元素中代码片段拿出来遍历，这样做比较高效
  node2Fragment(el) {
    const frag = document.createDocumentFragment();
    // 将el中所有子元素搬家至frag中
    let child;
    while ((child = el.firstChild)) {
      frag.appendChild(child);
    }
    return frag;
  }
  // 编译过程
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      // 类型判断
      if (this.isElement(node)) {
        // 元素
        // console.log('编译元素'+node.nodeName);
        // 查找k-，@，:
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr => {
          const attrName = attr.name; //属性名
          const exp = attr.value; // 属性值
          if (this.isDirective(attrName)) {
            // k-text
            const dir = attrName.substring(2);
            // 执行指令
            this[dir] && this[dir](node, this.$vm, exp);
          }
          if (this.isEvent(attrName)) {
            const dir = attrName.substring(1); // @click
            this.eventHandler(node, this.$vm, exp, dir);
          }
        });
      } else if (this.isInterpolation(node)) {
        // 文本
        // console.log('编译文本'+node.textContent);
        this.compileText(node);
      }

      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  compileText(node) {
    // console.log(RegExp.$1);
    this.update(node, this.$vm, RegExp.$1, "text");
  }

  // 更新函数
  update(node, vm, exp, dir) {
    const updaterFn = this[dir + "Updater"];
    // 初始化
    updaterFn && updaterFn(node, vm[exp]);
    // 依赖收集
    new Watcher(vm, exp, function(value) {
      updaterFn && updaterFn(node, value);
    });
  }

  text(node, vm, exp) {
    this.update(node, vm, exp, "text");
  }

  //   双绑
  model(node, vm, exp) {
    // 指定input的value属性
    this.update(node, vm, exp, "model");

    // 视图对模型响应
    node.addEventListener("input", e => {
      vm[exp] = e.target.value;
    });
  }

  modelUpdater(node, value) {
    node.value = value;
  }

  html(node, vm, exp) {
    this.update(node, vm, exp, "html");
  }

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }

  textUpdater(node, value) {
    node.textContent = value;
  }

  //   事件处理器
  eventHandler(node, vm, exp, dir) {
    //   @click="onClick"
    let fn = vm.$options.methods && vm.$options.methods[exp];
    if (dir && fn) {
      node.addEventListener(dir, fn.bind(vm));
    }
  }

  isDirective(attr) {
    return attr.indexOf("k-") == 0;
  }
  isEvent(attr) {
    return attr.indexOf("@") == 0;
  }
  isElement(node) {
    return node.nodeType === 1;
  }
  // 插值文本
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
}
```
### 入口文件
```
class LVue{
  constructor(options){
    this.$data=options.data
    this.$options=options
    this.observer(this.$data)
    // 新建一个watcher观察者对象，这时候Dep.target会指向这个watcher对象
    // new Watcher()
    // 在这里模拟render的过程，为了触发test属性的get函数
    console.log('模拟render,触发test的getter',this.$data)
    if(options.created){
      options.created.call(this)
    }
    this.$compile=new Compile(options.el,this)
  }
  obserber(value){
    if(!value||(typeof value!=='object')){
      return
    }
    Object.keys(value).forEach((key)=>{
      this.proxyData(key)
      this.defineReactive(value,key,value[key])
    })
  }
  defineReactive(obj,key,val){
    const dep=new Dep()
    Object.defineProperty(obj,key,{
      enumerable:true,
      configurable:true,
      get(){
        // 将Dep.target(即当前的watcher对象存入Dep的deps中
        Dep.target&&dep.addDep(Dep.target)
        return val
      },
      set(newVal){
        if(newVal===val) return
        val=newVal
        // 在set的时候触发dep的notify来通知所有的watcher对象更新视图
        dep.notify()
      }
    })
  }
  proxyData(key){
    Object.defineProperty(this,key,{
      configurable:true,  //   可配置
      enumerable:true,  //  可枚举
      get(){
        return this.$data[key]
      },
      set(newVal){
        this.$data[key]=newVal
      }
    })
  }
}
```
### 依赖收集Dep
```
class Dep{
  constructor(){
    // 存数所有的依赖
    this.deps=[]
  }
  // 在deps中添加一个监听器对象
  addDep(dep){
    this.deps.push(dep)
  }
  depend(){
    Dep.target.addDep(this)
  }
  // 通知所有监听器去更新视图
  notify(){
    this.deps.forEach((dep)=>{
      dep.update()
    })
  }
}
```
### 监听器
```
// 监听器
class watcher{
  constructor(vm,key,cb){
    // 在new一个监听器对象时将该对象赋值给Dep.target,在get中用到
    // 将Dep.target指向自己
    // 然后触发属性的getter添加监听
    // 最后将Dep.target置空
    this.cb=cb
    this.vm=vm
    this.key=key
    this.value=this.get()
  }
  get(){
    Dep.target=this
    let value=this.vm[this.key]
    return value
  }
  // 更新视图的方法
  update(){
    this.value=this.get()
    this.cb.call(this.vm,this.value)
  }
}
```
# 总结
***
- `vue`编译过程是怎样的？
首先编译是因为`vue`写的语句`HTML`不识别，可以进行依赖收集，模型和视图有依赖关系，后面模型发生变化可通知依赖的视图发生更新，然后模型推进视图的变化，这就是编译。
- 双向绑定的原理是什么？
`vue`利用`es5`的`defineProperty`这个属性，将`data`里面的数据每个都定义了一个`setter`和`getter`，这样我们就可以监听属性的变化，当属性变化的时候，我们就可以通知那些需要更新的地方进行更新。
