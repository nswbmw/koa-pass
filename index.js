const pathToRegexp = require('path-to-regexp')

module.exports = function (opts, _pathToRegexpOpts) {
  const parent = this
  if (!opts) return parent
  opts = Array.isArray(opts) ? opts : [opts]

  for (let i = 0; i < opts.length; ++i) {
    const opt = opts[i]
    if (!opt.method || !opt.path) {
      throw new TypeError('Missing `method` or `path` option')
    }
    opt.method = Array.isArray(opt.method) ? opt.method : [opt.method]
    opt.pass = (typeof opt.pass === 'function')
      ? opt.pass
      : () => (opt.pass !== undefined ? !!opt.pass : true)
  }

  return async function koaPass (ctx, next) {
    for (let i = 0; i < opts.length; ++i) {
      const opt = opts[i]
      if (
        !!~opt.method.indexOf(ctx.method) &&
        pathToRegexp(opt.path, [], _pathToRegexpOpts).exec(ctx.path) &&
        (await Promise.resolve(opt.pass(ctx)))
      ) {
        return next()
      }
    }

    await parent(ctx, next)
  }
}
