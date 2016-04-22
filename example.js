'use strict';

var koa = require('koa');
var jwt = require('koa-jwt')();
jwt.pass = require('./');

var app = koa();
app.use(jwt.pass({
  method: 'POST',
  path: '/:admin',
  pass: function* () {
    return ['/signin', '/signup'].indexOf(this.path) !== -1;
  }
}));
app.use(function* () {
  this.body = 'ok';
});
app.listen(3000);