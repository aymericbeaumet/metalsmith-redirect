# metalsmith-redirect [![Build Status](https://travis-ci.org/aymericbeaumet/metalsmith-redirect.svg?branch=master)](https://travis-ci.org/aymericbeaumet/metalsmith-redirect)

> A Metalsmith plugin to create HTTP redirections

## Install

```shell
npm install --save metalsmith-redirect
```

## Usage

### CLI

**metalsmith.json**

```json
{
  "plugins": {
    "metalsmith-redirect": {
      "redirections": {
        "/from/foo.html": "/to/bar.html"
      }
    }
  }
}
```

### API

```javascript
const metalsmith = require('metalsmith')
const metalsmithRedirect = require('metalsmith-redirect')

metalsmith(__dirname).use(
  metalsmithRedirect({
    redirections: {
      '/foo': '/img/foo.png',
      '/bar.html': '/img/',
    },
  })
)
```

**metalsmithRedirect(options)**

#### options

Type: `Object`
Default: `{}`

#### options.redirections

Type: `Object`
Default: `{}`

Each key/value will be used to create a redirection. Each key corresponds to
the source and the associated value to the destination.

Due to restrictions in the way this plugin proceeds, the source must be either:

- an HTML file path
- a folder path, in such a case '/index.html' will be appended

The destination can be any kind of path.

A relative path in the source will be resolved based on the site root `'/'`.

A relative path in the destination will be resolved based on the source directory.

#### options.markdown

Type: `boolean | Object`
Default: `false`

By setting this options to `true`, enable the extraction of redirections from
Markdown frontmatters. You can enable the extraction by using an object
instead, which has the advantage to allow you to set all the options
individually.

This feature is convenient to keep the redirections close to
the code. For example let's consider you have a file `/about.md` (see
below). If you want to create a redirection to `/about-me`, you would do:

```markdown
---
redirect: /about-me
---
```

Note: for this to work, this plugin must be `use`d before any markdown parser.

#### options.markdown.extensions

Type: `string[]`
Default: `[".md", ".mdown", ".markdown"]

A list of extensions this plugin uses to infer the type of a file as Markdown
(case-insensitive).

#### options.markdown.frontmatter

Type: `string`
Default: `"redirect"`

The frontmatter key to look for. It leverages
[`_.get`](https://lodash.com/docs#get), so you can do queries like:
`config.redirect` or `envs[0].redirect`. Unsuccessful queries are ignored.

#### options.markdown.keep

Type: `boolean`
Default: `false`

Whether the Markdown files should be kept after a redirection have been
extracted from their frontmatter. They are not kept by default.

#### options.preserveHash

Type: `boolean | Object`
Default: `false`

This option allows to preserve the hash from the source url. For example if
you redirect `/a` to `/b`, a visitor currently at `/a#comments` will be
redirected to `/b#comments`.

#### options.preserveHash.timeout

Type: `number`
Default: `1`

The number of second(s) after which the fallback should redirect the user
when hash preservation is enabled.

Why do we need a fallback? This feature will optimistically try to leverage
JavaScript to redirect the user, as this is the only way to access the
location hash. This will work in most cases, but for some users with
JavaScript disabled this means they could remain stuck. When this happens it
should fallback to the html meta redirection (which cannot preserve the
hashes due to its static nature).

## FAQ

> Can you give some example of the redirection algorithm?

You can find below some examples of user configurations and how they are
resolved by this plugin. For each example, the object is the configuration,
immediately followed by the file created by the plugin, an arrow, and the url
toward which the visitor will be redirected.

```javascript
{ 'foo': 'hidden.html' }
// '/foo/index.html' -> '/foo/hidden.html'
```

```javascript
{ '/foo/bar.html': 'baz' }
// '/foo/bar.html' -> '/foo/baz'
```

_It is possible to do external redirections:_

```javascript
{ '/github': 'https://github.com/segmentio' }
// '/github/index.html' -> 'https://github.com/segmentio'
```

_A Markdown file is not a valid source:_

```javascript
{ 'foo.md': 'hidden.html' } // Error: "foo.md" is not a valid html path
```
