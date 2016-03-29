'use strict'

var redirect = require('..')
var test = require('tape')

test('metalsmith-redirect should default to no redirections', function (t) {
  t.plan(1)
  var plugin = redirect()
  var files = {}
  plugin(files, null, function () {
    t.deepEqual(Object.keys(files).length, 0)
  })
})

test('metalsmith-redirect should use the redirections passed as the options', function (t) {
  t.plan(1)
  var plugin = redirect({ 'a': 'b' })
  var files = {}
  plugin(files, null, function () {
    t.ok('contents' in files['a/index.html'])
  })
})
