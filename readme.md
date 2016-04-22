## koa-pass

Conditionally skip a middleware when a condition is met.

### Install

    npm i koa-pass --save

### Usage

```
middleware.pass = require('koa-pass')
middleware.pass(opts, _pathToRegexpOpts)
```

- opts: {Object|Array}
  - method: {String|Array} http method, required.
  - path: {String} path for [path-to-regexp](https://www.npmjs.com/package/path-to-regexp), required.
  - pass: {Boolean|Function} if return true then pass, optional, default `true`.
- _pathToRegexpOpts: see [path-to-regexp](https://www.npmjs.com/package/path-to-regexp).

### Examples

```
var koa = require('koa');
var jwt = require('koa-jwt')();
jwt.pass = require('koa-pass');

var app = koa();
app.use(jwt.pass([
  { method: 'POST', path: '/signin' },
  { method: 'POST', path: '/signup' }
]));
...
app.listen(3000);
```

or:

```
var koa = require('koa');
var jwt = require('koa-jwt')();
jwt.pass = require('koa-pass');

var app = koa();
app.use(jwt.pass({
  method: 'POST',
  path: '/:admin',
  pass: function* () {
    return ['/signin', '/signup'].indexOf(this.path) !== -1;
  }
}));
...
app.listen(3000);
```

### Test

    npm test

### License

MIT