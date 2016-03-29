'use strict'

var normalize = require('../lib/normalize')
var test = require('tape')

test('normalize().get() should handle Unix style path', function (t) {
  var refs = {
    '/foo/bar': '/foo/bar'
  }
  t.plan(Object.keys(refs).length)
  Object.keys(refs).forEach(function (key) {
    t.deepEqual(normalize(refs[key]).get(), refs[key])
  })
})

test('normalize().get() should handle Windows style path', function (t) {
  var refs = {
    '\\foo\\bar': '/foo/bar'
  }
  t.plan(Object.keys(refs).length)
  Object.keys(refs).forEach(function (key) {
    t.deepEqual(normalize(refs[key]).get(), refs[key])
  })
})

test('normalize().appendHTMLIndexIfNeeded().get() should return the path without any modification if it\'s not a directory', function (t) {
  var refs = [
    'foo/index.md',
    '/foo/index.md',
    'index.md',
    '/index.md',
    'http://github.com/index.html',
    '../../index.md'
  ]
  t.plan(refs.length)
  refs.forEach(function (ref) {
    t.deepEqual(normalize(ref).appendHTMLIndexIfNeeded().get(), ref)
  })
})

test('normalize().appendHTMLIndexIfNeeded().get() should return the path with a HTML index appended if it\'s a directory', function (t) {
  var refs = {
    'foo': 'foo/index.html',
    '/foo': '/foo/index.html',
    '': 'index.html',
    '.': 'index.html',
    '/': '/index.html',
    '/////': '/index.html'
  }
  t.plan(Object.keys(refs).length)
  Object.keys(refs).forEach(function (key) {
    t.deepEqual(normalize(key).appendHTMLIndexIfNeeded().get(), refs[key])
  })
})

test('normalize().appendHTMLIndexIfNeeded().get() should properly support protocols (http://, ...)', function (t) {
  t.plan(1)
  t.deepEqual(normalize('http://foobar').appendHTMLIndexIfNeeded().get(), 'http://foobar/index.html')
})

test('normalize().ensureHTML() should not throw an exception if the wrapped path ends with a HTML file', function (t) {
  var refs = [
    'index.html',
    '/index.html',
    './index.html',
    '/foo/bar/baz.html',
    'http://foo.bar/index.html'
  ]
  t.plan(Object.keys(refs).length)
  refs.forEach(function (ref) {
    t.doesNotThrow(function () {
      normalize(ref).ensureHTML()
    })
  })
})

test('normalize().ensureHTML() should throw an exception if the wrapped path doesn\'t end with a HTML file', function (t) {
  t.plan(1)
  t.throws(function () {
    normalize('index.md').ensureHTML()
  }, / is not a valid HTML path$/)
})

test('normalize().relativeTo().get() should return a path relative to the given one', function (t) {
  /* ref / relative dir / result */
  var refs = [
    // 1st readme example
    ['foo', '/', '/foo'],
    ['hidden.html', '/foo', '/foo/hidden.html'],
    // 2nd readme example
    ['/foo/bar.html', '/', '/foo/bar.html'],
    ['baz', '/foo', '/foo/baz'],
    // 3rd readme example
    ['/github', '/', '/github'],
    ['https://github.com/segmentio', '', 'https://github.com/segmentio']
  ]
  t.plan(refs.length)
  refs.forEach(function (ref) {
    t.deepEqual(normalize(ref[0]).relativeTo(ref[1]).get(), ref[2])
  })
})
