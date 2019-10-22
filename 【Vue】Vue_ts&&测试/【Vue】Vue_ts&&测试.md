# 引言
***
此篇文章主要涉及以下内容：
1. `TypeScript`
2. 使用`TypeScript`编写`vue`应用
3. `vue`测试
4. 写易于测试的`vue`组件和代码
# 学习资源
***
- [TypeScript参考](https://www.tslang.cn/docs/home.html)
- [Vue中的TypeScript](https://cn.vuejs.org/v2/guide/typescript.html)
- [单元测试](https://cn.vuejs.org/v2/guide/unit-testing.html)
- [端到端测试参考](https://docs.cypress.io/api/api/table-of-contents.html)
# TypeScript
***
TypeScript是JavaScript的超集，它可编译为纯JavaScript，是一种给JavaScript添加特性的语言扩展。ts有如下特点：
- 类型注解和编译时类型检查
- 基于类的面向对象编程
- 泛型
- 接口
- 声明文件
## ts和es6
![](https://upload-images.jianshu.io/upload_images/15424855-0d4e79ee834b3dce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
> typescript是angular2的开发语言，Vue3正在使用TS重写

## 准备工作
新建一个基于ts的vue项目
```
vue create vue-ts
```
>选项选择：
>    - 自定义选项
>    - 添加ts支持
>    - 基于类的组件
>    - tslint

浏览基本项目结构
新建一个组件，components/Hello.vue
```
/* 展示模板 */
<template>
  <div id='app'>
  </div>
</template>
<script lang='ts'>
//导入组件
import Vue from 'vue'
export default Vue.extend({
  name: 'App'
})
</script>
<style>
/* 样式代码 */
#app {
}
</style>
```
在App.vue中引入
```
import Hello from './components/Hello.vue'
@component({
  components:{
    HelloWorld,
    Hello
  }
})
export default class App extendds Vue{}
```
## 类型注解和编译时类型检查
定义变量后，可以通过冒号来指定类型注解
```
//  Hello.vue
let name='xxx';  //  类型推论
let title:string= '123455';  // 类型注解
name=2;  //  错误
title=4;  // 错误
```
![](https://upload-images.jianshu.io/upload_images/15424855-79edb9639c9f9dc7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
数组类型
```
let names:string[];
names=['Tom'];  //  或Array<string>
```
任意类型
```
let foo:any='xxx'
foo=3

//  any类型也可用于数组
let list:any[]=[1,true,'free'];
list[1]=100;
```
函数中使用类型
```
function greeting(person:string):string{
  return 'Hello'+person;
}
// void类型，常用于没有返回值的函数
function warnUser():void{alert('this is my warning message');}
```
> 内置的类型
    1. string
    2. number
    3. boolean
    4. void函数不返回值
    5. any任意类型

范例，Hello.vue
```
<template>
  <div>
    {{msg}}
    {{foo}}
    <p>
      <input type="text" placeholder="输入特性名称" @keyup.enter="addFeature">
    </p>
    <ul>
      <li v-for="f in features" :key="f.id">{{f.name}}</li>
      <li>特性数量：{{featureCount}}</li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Emit,Watch } from "vue-property-decorator";

export class Feature {
  constructor(public id: number, public name: string, public version: string) {}
}

interface Result<T> {
  ok: 0 | 1;
  data: T[];
}
// 泛型函数
function getData<T>(): Promise<Result<T>> {
  const data: any[] = [
    { id: 1, name: "类型注解", version: "2.0" },
    { id: 2, name: "编译型语言", version: "1.0" }
  ];
  return Promise.resolve({ ok: 1, data } as Result<T>);
}

@Component({
  props: {
    // 属性也可以在这里配置
    sname: {
      type: String,
      default: "匿名"
    }
  }
})
export default class Hello extends Vue {
  // private 仅当前类可用
  // protected 子类也可以用
  // public  都可以用
  @Prop() private msg!: string; // 属性msg必填项，字符串类型
  @Prop({ default: "匿名" }) private foo?: string; // 属性foo必填项，字符串类型

  // 普通的属性相当于组件data
  private features: Feature[] = [];

  // 生命周期
  async created() {
    //...
    const result = await getData<Feature>();
    this.features = result.data;
  }

  // 计算属性
  get featureCount() {
    return this.features.length;
  }

  @Emit()
  private addFeature(event: any) {
    // 若没有返回值形参将作为事件参数
    const feature = {
      name: event.target.value,
      id: this.features.length + 1,
      version: "1.0"
    };
    this.features.push(feature);
    event.target.value = "";
    return feature; // 返回值作为事件参数
  }


@Watch('msg')
onRouteChange(val:string, oldVal:any){
    console.log(val, oldVal);
}
  //   addFeature(event: any) {
  //     console.log(event);

  //     this.features.push({
  //       name: event.target.value,
  //       id: this.features.length + 1,
  //       version: "1.0"
  //     });
  //     event.target.value = "";
  //   }
}

// 类型注解
let title: string;
let name = "xx"; // 类型推论

// 数组类型
// let names: Array<string>;
let names: string[];
names = ["tom", "jerry"];
// names[0] = 1; // 错误

// 任意类型
let list: any[] = [1, true, "free"];
list[0] = "lala";

// 函数中使用
function greeting(person: string): string {
  return "hello, " + person;
}
greeting("tom");

// void类型
function warn(): void {
  alert("warning!!!");
}

// 内置类型：string,number,boolean,void,any

// ts函数中如果声明，就是必选参数
function sayHello(name: string, age: number = 20): string {
  return name + " " + age;
}
sayHello("tom", 20);
sayHello("tom");

// 函数重载：多个同名函数，通过参数数量或者类型不同或者返回值不同
function info(a: { name: string }): string;
function info(a: string): object;
function info(a: any): any {
  if (typeof a === "object") {
    return a.name;
  } else {
    return { name: a };
  }
}
info({ name: "jerry" });
info("jerry");

class Shape {
  readonly foo: string = "foo";
  protected area: number;

  constructor(public color: string, width: number, height: number) {
    this.area = width * height;
  }

  shoutout() {
    return (
      "I'm " + this.color + " with an area of " + this.area + " cm squared."
    );
  }
}

class Square extends Shape {
  constructor(color: string, side: number) {
    super(color, side, side);
    console.log(this.color);
  }
  shoutout() {
    return "我是" + this.color + " 面积是" + this.area + "平方厘米";
  }
}
const square: Square = new Square("blue", 2);
console.log(square.shoutout());

class Employee {
  private firstName: string = "Mike";
  private lastName: string = "James";

  get fullName(): string {
    return this.firstName + " " + this.lastName;
  }
  set fullName(newName: string) {
    console.log("您修改了用户名");
    this.firstName = newName.split(" ")[0];
    this.lastName = newName.split(" ")[1];
  }
}
const employee = new Employee();

employee.fullName = "Bob Smith";

// 接口约束结构
interface Person {
  firstName: string;
  lastName: string;
  sayHello(): string; // 要求实现方法
}
// 类实现接口
class Greeter implements Person {
  constructor(public firstName = "", public lastName = "") {}
  sayHello() {
    return "Hello, " + this.firstName + " " + this.lastName;
  }
}
function greeting2(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}
const user = { firstName: "Jane", lastName: "User", sayHello: () => "lalala" };
const user2 = new Greeter("a", "b");
console.log(user);
console.log(greeting2(user2));
</script>

<style scoped>
</style>
```
## 函数
必填参：参数一旦声明，就要求传递，且类型需符合
```
function sayHello(name:string,age:number):string{
  console.log(name,age)
}
sayHello(11,12)  // 报错，与指定类型不一致
sayHello('xxx','xxx')  //  报错，与指定类型不一致
```
可选参数：参数名后面加上句号，变成可选参数
```
function sayHello(name:string,age?:number):string{
  console.log(name,age)
}
```
参数默认值
```
function sayHello(name:string,age:number=20):string{
  console.log(name,age)
}
```
函数重载：以参数数量或类型区分多个同名函数
```
function add(a:number,b:number):string;
function add(a:string,b:string):string;
function add(a:any,b:any):string{
  if(typeof a==='number'){
    return a+b;
  }else{
    return a+b
  }
}
console.log(add(1,1));
console.log(add('foo','bar'));
```
## 类
面向对象：
- 通过extends实现继承
- 使用public等访问修饰符实现封装
- 通过方法覆盖实现多态
```
class Shape {
  readonly foo: string = "foo";
  protected area: number;

  constructor(public color: string, width: number, height: number) {
    this.area = width * height;
  }

  shoutout() {
    return (
      "I'm " + this.color + " with an area of " + this.area + " cm squared."
    );
  }
}

class Square extends Shape {
  constructor(color: string, side: number) {
    super(color, side, side);
    console.log(this.color);
  }
  shoutout() {
    return "我是" + this.color + " 面积是" + this.area + "平方厘米";
  }
}
const square: Square = new Square("blue", 2);
console.log(square.shoutout());
```
> 注意事项：
>    -  私有private：当成员被标记成private时，它就不能在声明它的类的外部访问。
>    - 保护protected：protected成员在派生类中仍然可以访问。
>    - 只读readonly：只读属性必须在声明时或构造函数里被初始化。
>    - 参数属性：给构造函数的参数加上修饰符，能够定义并初始化一个成员属性。
>```
>  class Animal{
>    constructor(private name:string){//  定义name属性并将构造参赋值给他}
>  }
>```
>    - 存取器：当获取和设置属性时有额外逻辑时可以使用存取器（又称getter、setter）
>```
>class Employee{
>  private _fullName:string='Mike James';
>  get fullName():string{
>    return this._fullName;
>  }
>  set fullName(newName:string){
>    console.log('您修改了用户名');
>    this._fullName=newName;
>  }
>}
>const employee=new Employee();
>employee.fullName='Bob Smith';
>```
范例代码：通过类可以声明自定义类型约束数据结构，Hello.vue
```
// 定义一个特性类，拥有更多属性
class Feature {
  constructor(public id: number, public name: string, public version: string) {}
}

// 可以对获取的数据类型做约束
@Component
export default class HelloWorld extends Vue {
  private features: Feature[]

  constructor() {
    super()
    this.features = []
  }

  created() {
    setTimeout(()=>{
      // 数据结构相同即可，不必是Feature实例
      this.features=[
        {id:1,name:'类型注解',version:'2.0'},
        {id:2,name:'编译型语言',version:'1.0'}
      ];
    },1000)
  }
}

// template中的变化
<li v-for="feature in features" :key="feature">{{feature.name}} ,{{feature.version}}</li>
```
范例：利用getter设置计算属性
```
<li>特性数量：{{count}}</li>

get count(){
  return this.features.length;
}
```
## 接口
接口仅约束结构，不要求实现，使用更简单
```
interface Person {
  firstName: string
  lastName: string
}
function greeting(person:Person){
  return 'Hello,'+person.firstName+" "+person.lastName;
}
const user={firstName:'Jane',lastName:'User'};
console.log(user)
console.log(greeting(user))
```
面向接口编程
```
interface Person {
  firstName: string
  lastName: string
  sayHello(): string // 要求实现方法
}
// 实现接口
class Greeter implements Person {
  constructor(public firstName = '', public lastName = '') {}
  sayHello() {
    return 'Hello，' + this.firstName + ' ' + this.lastName
  }
}
// 面向接口编程
function greeting(person: Person) {
  return person.sayHello()
}
// const user = { firstName: 'Jane', lastName: 'User' }
const user = new Greeter('Jane', 'User') // 创建对象实例
console.log(user)
console.log(greeting(user))
```
范例：修改Feature为接口形式
```
<script lang='ts'>
// 接口中只需定义结构，不需要初始化
interface Feature{
  id:number;
  name:string;
  version:string;
}
</script>
```
## 泛型
泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。
```
// 不用泛型
// interface Result {
//   ok: 0 | 1
//   data: Feature
// }

//  使用泛型
interface Result<T> {
  ok: 0 | 1
  data: T[]
}
```
范例：使用泛型约束接口返回类型
```
// Hello.vue
function getData<T>(): Result<T> {
  const data: any[] = [
    { id: 1, name: '类型注解', version: '2.0' },
    { id: 2, name: '编译性语言', version: '1.0' }
  ]
  return { ok: 1, data }
}
```
使用接口
```
created(){
  this.features=getData<Feature>().data;
}
```
甚至返回Promise
```
function getData<T>(): Promise<Result<T>> {
  const data: any[] = [
    { id: 1, name: '类型注解', version: '2.0' },
    { id: 2, name: '编译型语言', version: '1.0' }
  ]
  return Promise.resolve({ ok: 1, data } as Result<T>)
}
```
使用
```
async created(){
  const result=await getData<Feature>();
  this.features=result.data;
}
```
## 装饰器
装饰器实际上是工厂函数，传入一个对象，输出处理后的新对象。
典型应用是组件装饰器@Component
```
@Component
export default class Hello extends Vue {}
```
> 若不加小括号，则装饰器下面紧挨着的对象就是目标对象

如果装饰器需要配置，则要以函数形式使用并传入配置
```
@Component({
  props:{ //  属性也可以在这里配置
    name:{
      type:String,
      default:'匿名'
    }
  }
})
export default class Hello extends Vue {}

// 类似的还有App.vue中配置的依赖组件选项components
```
范例：事件处理@Emit
新增特性时派发事件通知父组件，Hello.vue
```
// 通知父类新增事件，若未指定事件名则函数名作为事件名（羊肉串形式）
@Emit()
private addFeature(event:any){  // 若没有返回值形参将作为事件参数
  const feature={name:event.target.value,id:this.features.length+1};
  this.features.push(feature);
  event.target.value='';
  return feature; // 返回值作为事件参数
}
```
父组件接收并处理，App.vue
```
@Watch('msg')
onRouteChange(val:string,oldVal:any){
  console.log(val,oldVal);
}
```
# 测试
***
## 测试分类
常见的开发流程里，都有测试人员，这种我们成为黑盒测试，测试人员不管内部实现机制，只看最外层的输入输出，比如你写一个加法的页面，会设计N个case，测试加法的正确性，这种代码里，我们称之为**E2E测试**。
更负责一些的我们称之为**集成测试**，就是集合多个测试过的单元一起测试。
还有一种测试叫做白盒测试，我们针对一些内部机制的核心逻辑，使用代码进行编写，我们称之为**单元测试**。
> 测试是前端开发人员进阶必备的技能
> 我们日常使用console，算是测试的雏形

## 编写测试代码的好处
- 提供描述组件行为的文档
- 节省手动测试的事件
- 减少研发新特性时产生的bug
- 改进设计
- 促进重构
> 自动化测试使得大团队中的开发者可以维护复杂的基础代码。让你改代码不再小心翼翼。
![](https://upload-images.jianshu.io/upload_images/15424855-4084040962dd0cba.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## 准备工作
在vue中，推荐用Mocha+Chai或者Jest，演示代码使用Jest，它们语法基本一致
新建vue项目，手动选择特性，添加Unit Testing和E2E Testing
![](https://upload-images.jianshu.io/upload_images/15424855-12684068ceba3d9b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
单元测试解决方案选择：Jest
![](https://upload-images.jianshu.io/upload_images/15424855-0a9f5ad8f48e2b66.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
端到端测试解决方案选择：Cypress
![](https://upload-images.jianshu.io/upload_images/15424855-3e9baae7aef4a84c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## 单元测试
单元测试（unit testing），是指对软件中的最小可测试单元进行检查和验证。
新建test/unit/test.spec.js，`*.spec.js`是命名规范，写一下代码:
```
function add(num1,num2){
  return num1+num2
}

// 测试套件 test suite
describe('test',()=>{
  // 测试用例 test case
  interface('测试add函数',()=>{
    // 断言assert
    expect(add(1,3)).toBe(3)
    expect(add(1,3)).toBe(4)
    expect(add(-2,3)).toBe(1)
  })
})
```
## 执行单元测试
```
npm run test:unit
```
## api介绍
- describe：定义一个测试套件
- it：定义一个测试用例
- expect：断言的判断条件
- toBe：断言的比较结果
# 测试Vue组件
***
一个简单的组件
```
<template>
    <div>
    <span>{{ message }}</span>
    <button @click="changeMsg">点击</button>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        message: 'vue-text'
      }
    },
    created () {
      this.message = 'test vue组件'
    },
    methods:{
        changeMsg(){
            this.message = '按钮点击'
        }
    }
  }
</script>
```
```
// 导入 Vue.js 和组件，进行测试
import Vue from 'vue'
import KaikebaComp from '@/components/Kaikeba.vue'

describe('KaikebaComp', () => {
  // 检查原始组件选项
  it('由created生命周期', () => {
    expect(typeof KaikebaComp.created).toBe('function')
  })

  // 评估原始组件选项中的函数的结果
  it('初始data是vue-text', () => {
    // 检查data函数存在性
    expect(typeof KaikebaComp.data).toBe('function')
	// 检查data返回的默认值
    const defaultData = KaikebaComp.data()
    expect(defaultData.message).toBe('vue-text')
  })
})
```
##检查mounted之后
```
it('mount之后测试',()=>{
  const vm=new Vue(KaikebaComp).$mount()
  expect(vm.message).toBe('test vue组件')
}
```
## 用户点击
和写vue没什么本质区别，只不过我们用测试的角度去写代码，vue提供了专门针对测试的@vue/test-utils
```
it('按钮点击后',()=>{
  const wrapper=mount(KaikebaComp)
  wrapper.find('button').trigger('click')
  expect(wrapper.vm.message).toBe('按钮点击')
  //  测试HTML渲染结果
  expect(wrapper.find('span').html()).toBe('<span>按钮点击</span>')
})
```
## 测试覆盖率
jest自带覆盖率，如果用的mocha，需要使用istanbul来统计覆盖率
package.json里修改jest配置
```
'jest':{
  'collectCoverage':true,
  'collectCoverageFrom':['src/**/*.{js,vue}'],
}
```
在此执行npm run test:unit
可以看到我们kaikeba.vue的覆盖率是100%。

## 端到端测试E2E
借用浏览器的能力，站在用户测试人员的角度，输入框，点击按钮等，安全模拟用户，这个和具体的框架关系不大，完全模拟浏览器行为。
### 运行E2E测试
```
npm run test:e2e
```
E2E了解即可。
