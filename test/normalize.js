var chai = require('chai');
var expect = chai.expect;

var normalize = require('../lib/normalize');

describe('normalize().get()', function() {

  it('should handle Unix style path', function() {
    var refs = [
      '/foo/bar'
    ];

    refs.forEach(function(ref) {
      expect(normalize(ref).get()).to.equal(ref);
    });

  });

  it('should handle Windows style path', function() {
    var refs = {
      '\\foo\\bar': '/foo/bar'
    };

    for (var key in refs) {
      if (refs.hasOwnProperty(key)) {
        expect(normalize(key).get()).to.equal(refs[key]);
      }
    }
  });

});

describe('normalize().appendHTMLIndexIfNeeded().get()', function() {

  it('should return the path without any modification if it\'s not a directory', function() {
    var refs = [
      'foo/index.md',
      '/foo/index.md',
      'index.md',
      '/index.md',
      'http://github.com/index.html',
      '../../index.md'
    ];

    refs.forEach(function(ref) {
      expect(normalize(ref).appendHTMLIndexIfNeeded().get()).to.equal(ref);
    });
  });

  it('should return the path with a HTML index appended if it\'s a directory', function() {
    var refs = {
      'foo': 'foo/index.html',
      '/foo': '/foo/index.html',
      '': 'index.html',
      '.': 'index.html',
      '/': '/index.html',
      '/////': '/index.html'
    };

    for (var key in refs) {
      if (refs.hasOwnProperty(key)) {
        expect(normalize(key).appendHTMLIndexIfNeeded().get()).to.equal(refs[key]);
      }
    }
  });

});

describe('normalize().ensureHTML()', function() {

  it('should not throw an exception if the wrapped path ends with a HTML file', function() {
    var refs = [
      'index.html',
      '/index.html',
      './index.html',
      '/foo/bar/baz.html',
      'http://foo.bar/index.html'
    ];

    expect(function() {
      refs.forEach(function(ref) {
        normalize(ref).ensureHTML();
      });
    }).to.not.throw();
  });

  it('should throw an exception if the wrapped path doesn\'t end with a HTML file', function() {
    expect(function() {
      normalize('index.md').ensureHTML();
    }).to.throw(/ is not a valid HTML path$/);

  });

});

describe('normalize().relativeTo().get()', function() {

  it('should return a path relative to the given one', function() {
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
    ];

    refs.forEach(function(ref) {
      expect(normalize(ref[0]).relativeTo(ref[1]).get()).to.equal(ref[2]);
    });
  });

});
