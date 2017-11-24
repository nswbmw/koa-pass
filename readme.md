## koa-pass

> Conditionally skip a middleware when a condition is met.

**NB:** koa-pass@1 for koa@1.

### Install

```sh
$ npm i koa-pass --save
```

### Usage

```js
middleware.pass = require('koa-pass')
middleware.pass(opts, _pathToRegexpOpts)
```

- opts: {Object|Array}
  - method: {String|Array} http method, required.
  - path: {String} path for [path-to-regexp](https://www.npmjs.com/package/path-to-regexp), required.
  - pass: {Boolean|Function} if return true then pass, optional, default `true`.
- _pathToRegexpOpts: {Object} see [path-to-regexp](https://www.npmjs.com/package/path-to-regexp).

### Examples

```js
const Koa = require('koa')
const res = require('koa-res')()
res.pass = require('./')

const app = new Koa()
app.use(res.pass([
  { method: 'GET', path: '/pass' }
]))
app.use((ctx) => {
  ctx.body = 'ok'
})
app.listen(3000, () => {
  console.log('listening on 3000')
})
```

or:

```js
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
```

### Test

```sh
$ npm test
```

### License

MIT