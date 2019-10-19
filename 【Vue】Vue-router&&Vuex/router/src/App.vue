<template>
  <div id="app">
    <router-link :to="{name: 'pageA'}">pageA</router-link> |
    <router-link to="/a/1">参数1</router-link> |
    <router-link to="/a/2">参数2</router-link> |
    <router-link to="/b">pageB</router-link>
    <router-view/>
    <router-view name="david"/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
