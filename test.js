const express = require('express')
const Vue = require('vue')

const app = express()
const renderer = require('vue-server-renderer').createRenderer()
const page = new Vue({
  data: {
    name: 'XXXXXX',
    count: 1
  },
  template: `
    <div>
      <h1>{{name}}</h1>
      <h1>{{count}}</h1>
    </div>
  `
})

app.get('/', async function (req, res) {
  const html = await renderer.renderToString(page)
  res.send(html)
})

app.listen(3000, () => {
  console.log('启动成功')
})