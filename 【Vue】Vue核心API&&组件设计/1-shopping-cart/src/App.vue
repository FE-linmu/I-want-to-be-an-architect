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

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
