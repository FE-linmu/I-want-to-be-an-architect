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

<style scoped>
</style>