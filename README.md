# metalsmith-redirect [![Build Status](https://travis-ci.org/aymericbeaumet/metalsmith-redirect.svg?branch=master)](https://travis-ci.org/aymericbeaumet/metalsmith-redirect) [![NPM version](https://badge.fury.io/js/metalsmith-redirect.svg)](http://badge.fury.io/js/metalsmith-redirect)

A Metalsmith plugin to create HTTP redirections.

## Installation

```javascript
$ npm install metalsmith-redirect
```

## Usage

### CLI

```javascript
{
  "plugins": {
    "metalsmith-redirect": {
      "/from/foo.html": "/to/bar.html"
    }
  }
}
```

### JavaScript

```javascript
var MetalSmith = require('metalsmith');
var redirect = require('metalsmith-redirect');

Metalsmith(__dirname)
  .use(redirect({
    '/foo': '/img/foo.png',
    '/bar.html': '/img/'
  }));
```

This plugin can be configured by passing an object. Each key/value will be used
to create a redirection. Each key corresponds to the source and the associated
value to the destination.

Due to restrictions in the way this plugin proceeds, the source must be either:
- a HTML file path
- a folder path, in such a case '/index.html' will be appended

The destination can be any kind of path.

A relative path in the source will be resolved from '/'.

A relative path in the destination will be resolved from the source directory.

## Examples

Some examples of user configurations and how they are resolved by this plugin.
For each example, the first object is the user configuration, and the second
object is what is resolved by the plugin.


```javascript
{ 'foo': 'hidden.html' }
{ '/foo/index.html': '/foo/hidden.html' }
```

```javascript
{ '/foo/bar.html': 'baz' }
{ '/foo/bar.html': '/foo/baz' }
```

```javascript
// It is possible to do external redirections.
{ '/github': 'https://github.com/segmentio' }
{ '/github/index.html': 'https://github.com/segmentio' }
```

```javascript
// A Markdown file is not a valid source
{ 'foo.md': 'hidden.html' } // throw error
```


## Changelog

* 0.0.3
  * Now use `rel=canonical` in the redirection template

* 0.0.2
  * Automatic NPM deployment from Travis
  * Fix the normalize.relativeTo() method

* 0.0.1
  * Internal redirections (both absolute and relative)
  * External redirections (toward other websites)

## License

MIT © [Aymeric Beaumet](http://beaumet.me)
