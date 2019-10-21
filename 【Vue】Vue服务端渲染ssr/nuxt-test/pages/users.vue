<template>
  <div>
    用户导航
    <nuxt-child></nuxt-child>
    <!-- {{foo.bar}} -->
    <ul>
        <li v-for="user in users" :key="user.id">{{user.name}}</li>
    </ul>
  </div>
</template>

<script>


function getUsers() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([{ name: "tom", id: 1 }, { name: "jerry", id: 2 }]);
      }, 1500);
    });
}

export default {
  layout: "users",
  head: {
    title: "用户列表"
  },
  async asyncData() {
      console.log(process.server);
      
    // 使用async/await
    const users = await getUsers();
    // return的数据最终回合data中的合并
    return { users };
  }
};
</script>

<style scoped>
</style>