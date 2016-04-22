'use strict';

const pathToRegexp = require('path-to-regexp');

module.exports = function(opts, _pathToRegexpOpts) {
  let parent = this;
  if (!opts) return parent;
  opts = Array.isArray(opts) ? opts : [opts];

  for (let i = 0; i < opts.length; ++i) {
    let opt = opts[i];
    if (!opt.method || !opt.path) {
      throw new TypeError('Missing method and path');
    }
    opt.method = Array.isArray(opt.method) ? opt.method : [opt.method];
    let pass = opt.pass !== undefined ? opt.pass : true;
    opt.pass = 'function' === typeof pass ? pass : function* () { return !!pass; };
  }  

  return function* pass(next) {
    for (let i = 0; i < opts.length; ++i) {
      let opt = opts[i];
      if (!!~opt.method.indexOf(this.method) &&
          pathToRegexp(opt.path, [], _pathToRegexpOpts).exec(this.path) &&
          (yield opt.pass.call(this))) {
        return yield *next;
      }
    }

    yield* parent.call(this, next);
  };
};
