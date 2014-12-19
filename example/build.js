'use strict';

var Metalsmith = require('metalsmith');
var redirect = require('../lib'); // require('metalsmith-redirect');

Metalsmith(__dirname)
  .use(redirect({
    '/github': 'https://github.com'
  }))
  .build(function(err) { if (err) { throw err } });
