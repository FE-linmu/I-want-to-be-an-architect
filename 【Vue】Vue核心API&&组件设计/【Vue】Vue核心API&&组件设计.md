# 引言
***
此篇文章主要涉及以下内容：
1. 实现一个购物车案例
2. 掌握`vue`核心`API`
3. 深入了解`vue`的组件化机制
4. 第三方组件库`element-ui`应用
5. 设计并实现表单组件
# 实现一个购物车案例
***
- 实现课程列表
```
<template>
  <div id="app">
    <h1>{{title}}</h1>
    <hr />
    <div>
      <h2>添加课程</h2>
      <div>
        <label for="">课程名称：</label>
        <input type="text"
               v-model="courseInfo.name">
      </div>
      <div>
        <label for="">课程价格：</label>
        <input type="text"
               v-model="courseInfo.price">
      </div>
      <div>
        <button @click="addCourseToList">添加课程到列表</button>
      </div>
    </div>
    <div>
      <h2>课程列表</h2>
      <table>
        <tr>
          <th>课程名称</th>
          <th>课程价格</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item,index) in courseList"
            :key="item.id">
          <td>{{item.name}}</td>
          <td>{{item.price}}</td>
          <td><button @click="addCourseToCart(index)">添加到购物车</button></td>
        </tr>

      </table>

    </div>
    <cart :courseItem="courseItem"
          @removeItem="remove"></cart>
  </div>
</template>

<script>
import Cart from './components/Cart.vue';
export default {
  name: 'app',
  components: {
    Cart
  },
  data () {
    return {
      title: '购物车',
      courseInfo: {
        name: '',
        price: ''
      },
      courseItem: [],
      courseList: [
        {
          id: 0,
          name: 'web全栈开发架构师',
          price: 9998
        }, {
          id: 1,
          name: 'Python人工智能',
          price: 8888
        }
      ]
    }
  },
  methods: {
    addCourseToCart (index) {
      let item = this.courseList[index];
      /* 
      find() 方法返回通过测试（函数内判断）的数组的第一个元素的值。
      
      find() 方法为数组中的每个元素都调用一次函数执行：
      
      当数组中的元素在测试条件时返回 true 时, find() 返回符合条件的元素，之后的值不会再调用执行函数。
      如果没有符合条件的元素返回 undefined
      注意: find() 对于空数组，函数是不会执行的。
      注意: find() 并没有改变数组的原始值。
      */
      let isHasCourse = this.courseItem.find(x => x.id == item.id)
      if (isHasCourse) {
        isHasCourse.number += 1;
      } else {
        this.courseItem.push({
          ...item,
          number: 1,
          isActive: true
        });
      }

    },
    remove (index) {
      /* splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。
      注释：该方法会改变原始数组。 */
      this.courseItem.splice(index, 1)
    },
    addCourseToList () {
      // push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
      this.courseList.push(this.courseInfo)
    }
  }
}
</script>
```
- 购物车
```
<template>
  <div>
    <h2>我是购物车</h2>
    <table>
      <tr>
        <td>勾选</td>
        <td>课程名称</td>
        <td>课程价格</td>
        <td>数量</td>
        <td>价格</td>
      </tr>
      <tr v-for="(item,index) in courseItem"
          :key="item.id">
        <td>
          <input type="checkbox"
                 v-model="item.isActive">
        </td>
        <td>{{item.name}}</td>
        <td>{{item.price}}</td>
        <td>
          <button @click="minus(index)">-</button>
          {{item.number}}
          <button @click="add(index)">+</button>
        </td>
        <td>{{item.price*item.number}}</td>
      </tr>
      <tr>
        <td></td>
        <td colspan="2">{{isActiveCourse}}/{{allCourseList}}</td>
        <td colspan="2">{{allPrice}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  // 遵守单项数据流
  props: ['courseItem'],
  methods: {
    minus (index) {
      let number = this.courseItem[index].number;
      if (number > 1) {
        this.courseItem[index].number -= 1;
      } else {
        if (window.confirm('确定要出删除吗')) {
          // 事件抛发机制，子组件抛，父组件接，单向数据流改变数据
          this.$emit('removeItem', index)
        }
      }
    },
    add (index) {
      this.courseItem[index].number += 1;
    }
  },
  computed: {
    isActiveCourse () {
      /* 、
      filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。

        注意： filter() 不会对空数组进行检测。

        注意： filter() 不会改变原始数组。
      */
      return this.courseItem.filter(item => item.isActive).length
    },
    allCourseList () {
      return this.courseItem.length;
    },
    allPrice () {
      let num = 0;
      // forEach会改变原数组，map不会改变原数组，而会返回一个新数组
      this.courseItem.forEach(item => {
        if (item.isActive) {
          num += item.price * item.number
        }
      })
      return num;
    }
  },
}
</script>
```
# 组件化
***
- 组件化思想
![](https://upload-images.jianshu.io/upload_images/15424855-8d8bf070948ea297.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 第三方组件应用
1. `Element-UI`：https://element.eleme.cn/#/zh-CN
2. `element`集成：`vue add element`
3. 组件使用：创建一个登陆表单并可以校验用户输入
```
<template>
  <div>
    <h3>Element表单</h3>
    <hr>
    <el-form :model="model"
             :rules="rules"
             ref="loginForm">
      <el-form-item label="用户名"
                    prop="username">
        <el-input v-model="model.username"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码"
                    prop="password">
        <el-input type="password"
                  v-model="model.password"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('loginForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: '',
      model: { username: "tom", password: "" },
      rules: {
        username: [
          { required: true, message: "请输入用户名" },
        ],
        password: [
          { required: true, message: "请输入密码" }
        ],
      }
    };
  },
  methods: {
    submitForm (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          alert('请求登录!')
        } else {
          alert('校验失败！')
        }
      })
    }
  },
}
</script>
```
> 需要在`element.js`导入`Form`、`FormItem`和`Input`
```
import Vue from 'vue'
import { Button,Form,FormItem,Input } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
```
- 组件设计：实现`Form`、`FormItem`和`Input`
> 需要思考的几个问题？
> 1. Input是自定义组件，它是怎么实现双向绑定的？
> 2. FormItem是怎么知道执行校验的，它是怎么知道Input状态的？它是怎么获得对应数据模型的？
> 3. Form是怎么进行全局校验的？它用什么办法把数据模型和校验规则传递给内部组件？

 设计思想
![](https://upload-images.jianshu.io/upload_images/15424855-c5d986bf8d5416dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 *  实现`input`
    * 任务1：实现自定义组件双向绑定功能
        > v-model是语法糖，实现自定义组件双向数据绑定需要指定:value和@input即可

    * 任务2：值发生变化能够通知`FormItem`组件
        ```
        <template>
            <div>
                <input :type="type" :value="value" @input="onInput">
            </div>
        </template>

        <script>
            export default {
                props:{
                    value:{
                        type:String,
                        default:''
                    },
                    type:{
                        type:String,
                        default:'text'
                    }
                },
                methods: {
                    onInput(e) {
                        let value = e.target.value;
                        this.$emit('input',value);
                        this.$parent.$emit('validate')
                    }
                },
            }
        </script>
        ```
- 实现`FromItem`
    - 任务1：给`Input`预留插槽——`slot`
        - 匿名插槽
        ```
        // 定义parent中插槽
        <div><slot></slot></div>
        // 使用parent并指定插槽内容
        <parent>content</parent>
        ```
        - 具名插槽
        ```
        // 定义parent中插槽
        <div><slot name="top"></slot><slot></slot></div>
        // 使用parent并指定插槽内容
        <parent><template slot="top">top content</template>content</parent>
        ```
    - 任务2：能够展示label和校验信息
    - 任务3：能够进行校验
        ```
      <template>
        <div>
          <label v-if="label">{{label}}</label>
          <slot></slot>
          <p v-if="error">{{error}}</p>
        </div>
      </template>

      <script>
      export default {
        props: {
          label: { // 输入项标签
            type: String,
            default: ''
          },
          prop: {  // 字段名
            type: String,
            default: ''
          },
        },
        data () {
          return {
            error: '' // 校验错误
          }
        }
      }
      </script>
        ```
- 实现`form`
    - 给`form-item`预留槽位
    - 将数据传递给后代便于他们访问数据模型和校验规则
        - `provide`&&`inject`
        ```
        <template>
          <form>
            <slot></slot>
          </form>
        </template>
        <script>
        export default {
          provide () {
            return {
              form: this // 将组件实例作为提供者，子代组件可方便获取
            }
          },
          props: {
            model: {
              type: Object,
              required: true
            },
            rules: {
              type: Object
            }
          }
        }
        </script>
        ```
- 数据校验
    - 思路：校验发生在`FormItem`，它需要知道何时校验（让`input`通知它），还需要知道怎么校验（注入校验规则）
    - 任务1：`Input`通知校验
    ```
    onInput(e){
      // ...
      // $parent指FormItem
      this.$parent.$emit('validate');
    }
    ```
    - 任务2：`FormItem`监听校验通知，获取规则并执行校验
    ```
    inject:['form'],  // 注入
    mounted(){   // 监听校验事件
      this.$on('validate',this.validate)
    },
    methods:{
      validate(){
        // 获取对应FormItem校验规则
        console.log(this.form.rules[this.prop]);
        // 获取校验值
        console.log(this.form.model[this.prop]);
      }
    }
    ```
    - 安装`async-validator:npm i async-validator -S`
    ```
    import schema from 'async-validator';
    validate(){
      // 获取对应FromItem校验规则
      const rules=this.form.rules[this.prop];
      // 获取校验值
      const value=this.form.model[this.prop];
      // 校验描述对象
      const descriptor={[this.prop]:rules};
      // 创建校验器
      const schema=new Schema(descriptor);
      schema.validate({[this.prop]:value},errors=>{
        if(errors){
          // 将错误信息显示
          this.error=error[0].message;
        }else{
          // 校验通过
          this.error='';
        }
      })
    }
    ```