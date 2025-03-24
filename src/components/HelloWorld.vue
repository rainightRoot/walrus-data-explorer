<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      欢迎来到您的 Vue.js 应用<br>
      更多信息请查看
      <a href="https://vuejs.org" target="_blank" rel="noopener">Vue 官方文档</a>.
    </p>
    <h3>安装的插件</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style> 