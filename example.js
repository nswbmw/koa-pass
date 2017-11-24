const Koa = require('koa')
const res = require('koa-res')()
res.pass = require('./')

const app = new Koa()
app.use(res.pass({
  method: 'GET',
  path: '/:name',
  pass: async (ctx) => {
    return ctx.path === '/pass'
  }
}))
app.use((ctx) => {
  ctx.body = 'ok'
})
app.listen(3000, () => {
  console.log('listening on 3000')
})
