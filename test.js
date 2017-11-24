const assert = require('assert')
const Koa = require('koa')
const request = require('supertest')
const res = require('koa-res')()
const pass = require('./')
res.pass = pass

describe('koa-pass', () => {
  it('Missing `method` or `path` option', (done) => {
    const app = new Koa()
    try {
      app.use(res.pass([
        { method: 'GET' }
      ]))
    } catch (e) {
      assert.equal(e.message, 'Missing `method` or `path` option')
    }
    done()
  })
  it('method: string', (done) => {
    const app = new Koa()
    app.use(res.pass([
      { method: 'GET', path: '/:name' }
    ]))
    app.use((ctx) => {
      ctx.body = 'ok'
    })

    request(app.callback())
      .get('/nswbmw')
      .expect(200)
      .end((err, res) => {
        assert.equal(err, null)
        assert.equal(res.text, 'ok')
        request(app.callback())
          .post('/nswbmw')
          .expect(200)
          .end((err, res) => {
            assert.equal(err, null)
            assert.equal(res.body.data, 'ok')
            done()
          })
      })
  })
  it('method: array', (done) => {
    const app = new Koa()
    app.use(res.pass([
      { method: ['GET', 'POST'], path: '/:name' }
    ]))
    app.use((ctx) => {
      ctx.body = 'ok'
    })

    request(app.callback())
      .post('/nswbmw')
      .expect(200)
      .end((err, res) => {
        assert.equal(err, null)
        assert.equal(res.text, 'ok')
        request(app.callback())
          .get('/nswbmw')
          .expect(200)
          .end((err, res) => {
            assert.equal(err, null)
            assert.equal(res.text, 'ok')
            done()
          })
      })
  })
  it('pass: boolean', (done) => {
    const app = new Koa()
    app.use(res.pass([
      { method: 'GET', path: '/:name', pass: false }
    ]))
    app.use((ctx) => {
      ctx.body = 'ok'
    })

    request(app.callback())
      .get('/nswbmw')
      .expect(200)
      .end((err, res) => {
        assert.equal(err, null)
        assert.equal(res.text, 'ok')
        request(app.callback())
          .get('/')
          .expect(200)
          .end((err, res) => {
            assert.equal(err, null)
            assert.equal(res.body.data, 'ok')
            done()
          })
      })
  })
  it('pass: function', (done) => {
    const app = new Koa()
    app.use(res.pass([
      { method: 'GET', path: '/:name', pass: (ctx) => { return ctx.path === '/nswbmw' } }
    ]))
    app.use((ctx) => {
      ctx.body = 'ok'
    })

    request(app.callback())
      .get('/nswbmw')
      .expect(200)
      .end((err, res) => {
        assert.equal(err, null)
        assert.equal(res.text, 'ok')

        request(app.callback())
          .get('/nswbmw1')
          .expect(200)
          .end((err, res) => {
            assert.equal(err, null)
            assert.equal(res.body.data, 'ok')
            done()
          })
      })
  })
  it('_pathToRegexpOpts', (done) => {
    const app = new Koa()
    app.use(res.pass([
      { method: 'GET', path: '/:name' }
    ], {
      strict: true
    }))
    app.use((ctx) => {
      ctx.body = 'ok'
    })

    request(app.callback())
      .get('/nswbmw/')
      .expect(200)
      .end((err, res) => {
        assert.equal(err, null)
        assert.equal(res.body.data, 'ok')

        request(app.callback())
          .get('/nswbmw')
          .expect(200)
          .end((err, res) => {
            assert.equal(err, null)
            assert.equal(res.text, 'ok')
            done()
          })
      })
  })
})
