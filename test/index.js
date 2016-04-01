'use strict'

const redirect = require('..')
const test = require('tape')

test('metalsmith-redirect should default to no redirections', function (t) {
  t.plan(1)
  const plugin = redirect()
  const files = {}
  plugin(files, null, function () {
    t.deepEqual(Object.keys(files).length, 0)
  })
})

test('metalsmith-redirect should use the redirections passed as the options', function (t) {
  t.plan(1)
  const plugin = redirect({ 'a': 'b' })
  const files = {}
  plugin(files, null, function () {
    console.log(files)
    t.deepEqual(files['a/index.html'].contents, `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0;url=/a/b">
    <link rel="canonical" href="/a/b">
    <script>window.location.replace('/a/b');</script>
  </head>
  <body>This page has been moved <a href="/a/b">here</a>.</body>
</html>
`)
  })
})
