'use strict';

var assert = require('assert');
var koa = require('koa');
var request = require('supertest');
var jwt = require('koa-jwt')();
var pass = require('./');
jwt.pass = pass;

describe('koa-pass', function() {
  it('No arguments', function (done) {
    var app = koa();
    app.use(jwt.pass());

    request(app.callback())
      .get('/')
      .expect(401)
      .end(function(err, res) {
        assert.equal(err, null);
        assert.equal(res.text.trim(), 'No Authorization header found');
        done();
      });
  });
  it('Missing method and path', function (done) {
    var app = koa();
    try {
      app.use(jwt.pass([
        { method: 'GET' }
      ]));
    } catch(e) {
      assert.equal(e.message, 'Missing method and path');
    }
    done();
  });
  it('No Authorization header found', function (done) {
    var app = koa();
    app.use(jwt.pass([
      { method: 'GET', path: '/', pass: false }
    ]));
    app.use(function* () {
      this.body = 'ok';
    });

    request(app.callback())
      .get('/')
      .expect(401)
      .end(function(err, res) {
        assert.equal(err, null);
        assert.equal(res.text.trim(), 'No Authorization header found');
        done();
      });
  });
  it('ok: method array', function (done) {
    var app = koa();
    app.use(jwt.pass([
      { method: ['GET', 'POST'], path: '/:name' }
    ]));
    app.use(function* () {
      this.body = 'ok';
    });

    request(app.callback())
      .post('/nswbmw/')
      .expect(200)
      .end(function(err, res) {
        assert.equal(err, null);
        assert.equal(res.text, 'ok');
        done();
      });
  });
  it('ok: pass boolean', function (done) {
    var app = koa();
    app.use(jwt.pass([
      { method: ['GET', 'POST'], path: '/:name', pass: false }
    ]));
    app.use(function* () {
      this.body = 'ok';
    });

    request(app.callback())
      .get('/nswbmw')
      .expect(401)
      .end(function(err, res) {
        assert.equal(err, null);
        assert.equal(res.text.trim(), 'No Authorization header found');
        done();
      });
  });
  it('ok: pass function', function (done) {
    var app = koa();
    app.use(jwt.pass([
      { method: ['GET', 'POST'], path: '/:name', pass: function* () { return this.path === '/nswbmw'; } }
    ]));
    app.use(function* () {
      this.body = 'ok';
    });

    request(app.callback())
      .get('/nswbmw')
      .expect(200)
      .end(function(err, res) {
        assert.equal(err, null);
        assert.equal(res.text, 'ok');
        
        request(app.callback())
          .get('/nswbmw1')
          .expect(401)
          .end(function(err, res) {
            assert.equal(err, null);
            assert.equal(res.text.trim(), 'No Authorization header found');
            done();
          });
      });
  });
  it('_pathToRegexpOpts', function (done) {
    var app = koa();
    app.use(jwt.pass([
      { method: ['GET', 'POST'], path: '/:name' }
    ], {
      strict: true
    }));
    app.use(function* () {
      this.body = 'ok';
    });

    request(app.callback())
      .get('/nswbmw/')
      .expect(401)
      .end(function(err, res) {
        assert.equal(err, null);
        assert.equal(res.text.trim(), 'No Authorization header found');
        
        request(app.callback())
          .get('/nswbmw')
          .expect(200)
          .end(function(err, res) {
            assert.equal(err, null);
            assert.equal(res.text, 'ok');
            done();
          });
      });
  });
});