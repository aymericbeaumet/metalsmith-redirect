<center>

# metalsmith-redirect

[![npm](https://img.shields.io/npm/v/metalsmith-redirect?style=flat-square)](https://www.npmjs.com/package/metalsmith-redirect)
[![Travis CI](https://img.shields.io/travis/aymericbeaumet/metalsmith-redirect?style=flat-square)](https://travis-ci.org/aymericbeaumet/metalsmith-redirect)
[![Dependencies](https://img.shields.io/david/aymericbeaumet/metalsmith-redirect?style=flat-square)](https://david-dm.org/aymericbeaumet/metalsmith-redirect)
[![Issues](https://img.shields.io/github/issues/aymericbeaumet/metalsmith-redirect?style=flat-square)](https://github.com/aymericbeaumet/metalsmith-redirect/issues)
[![License](https://img.shields.io/github/license/aymericbeaumet/metalsmith-redirect?style=flat-square)](https://github.com/aymericbeaumet/metalsmith-redirect/blob/master/license)

</center>

This plugins enables you to create HTTP redirections in your [Metalsmith](https://metalsmith.io/) website.

## Install

```shell
npm install metalsmith-redirect
```

## Usage

### CLI

You can pass any options you would like in the _metalsmith.json_
configuration file at the key `plugins["metalsmith-redirect"]`. See the
[API](#api) section for more information regarding the possible options you
can give to this plugin.

_metalsmith.json_

```json
{
  "plugins": {
    "metalsmith-redirect": {
      "redirections": {
        "/about": "/about-me",
        "/images": "/search?kind=image"
      }
    }
  }
}
```

### Node.js

For more complex use-cases, Metalsmith exposes a [JavaScript
API](https://github.com/segmentio/metalsmith#api):

```javascript
const metalsmith = require('metalsmith')
const metalsmithRedirect = require('metalsmith-redirect')

metalsmith(__dirname).use(
  metalsmithRedirect({
    redirections: {
      '/about': '/about-me',
      '/images': '/search?kind=image',
    },
  })
)
```

## API

Notes:

- Due to restrictions due to the client-side implementation, the **source**
  must either be an HTML file, or a folder (in which case `'/index.html'` will
  be appended)
- The **destination** can be any kind of path
- A relative path in the **source** will be resolved based on the site root `'/'`
- A relative path in the **destination** will be resolved based on the **source** directory

### metalsmithRedirect(options)

#### options

Type: `Object`
Default: `{}`

#### options.redirections

Type: `Object`
Default: `{}`

Each key value pair from the object will be used to create a redirection,
where each key corresponds to the **source** url and its associated value to
the **destination** url.

<details><summary>Example</summary>

In this piece of code we create two redirections:

1. from `/about` to `/about-me`
2. from `/images` to `/search?kind=image`

```javascript
const metalsmith = require('metalsmith')
const metalsmithRedirect = require('metalsmith-redirect')

metalsmith(__dirname).use(
  metalsmithRedirect({
    redirections: {
      '/about': '/about-me',
      '/images': '/search?kind=image',
    },
  })
)
```

</details>

#### options.frontmatter

Type: `boolean | Object`
Default: `false`

By setting this options to `true`, you will enable the collections of
redirections from frontmatters. This feature is convenient to keep the
redirections close to the code. You can also pass an object instead, which
has the advantage to allow to set all the options individually.

<details><summary>Example: redirect from another page</summary>

Let's consider you have a file `/photos/index.html`, if you want to create a
redirection _from_ `/images`, you would update its frontmatter in this
fashion:

_/photos/index.html_

```html
---
redirectFrom: /images
---

<html>
  <!--- ... -->
</html>
```

</details>

<details><summary>Example: redirect to another page</summary>

Let's consider you have a file `/about.md`, if you want to create a
redirection to `/about-me`, you would update its frontmatter in this fashion:

_/about.md_

```markdown
---
redirectTo: /about-me
---
```

</details>

#### options.frontmatter.redirectFrom

Type: `string`
Default: `"redirectFrom"`

The _redirectFrom_ path to search for in the frontmatters. It leverages
[`_.get`](https://lodash.com/docs#get), so you can perform queries like:
`config.redirectFrom` or `envs[0].redirectFrom`.

<details><summary>Example</summary>

Let's say I like to keep things tidied up and I want to scope all my plugin
configuration under the `config` key, this is how it is possible to instruct
the plugin to do so:

```javascript
const metalsmith = require('metalsmith')
const metalsmithRedirect = require('metalsmith-redirect')

metalsmith(__dirname).use(
  metalsmithRedirect({
    frontmatter: {
      redirectFrom: 'config.redirectFrom',
    },
  })
)
```

The plugin will then look for this key in any of the frontmatters:

```markdown
---
config:
  redirectFrom: /about
---
```

</details>

#### options.frontmatter.redirectTo

Type: `string`
Default: `"redirectTo"`

The _redirectTo_ path to search for in the frontmatters. It leverages
[`_.get`](https://lodash.com/docs#get), so you can perform queries like:
`config.redirectTo` or `envs[0].redirectTo`.

<details><summary>Example</summary>

Let's say I like to keep things tidied up and I want to scope all my plugin
configuration under the `config` key, this is how it is possible to instruct the plugin to do so:

```javascript
const metalsmith = require('metalsmith')
const metalsmithRedirect = require('metalsmith-redirect')

metalsmith(__dirname).use(
  metalsmithRedirect({
    frontmatter: {
      redirectTo: 'config.redirectTo',
    },
  })
)
```

The plugin will then look for this key in any of the frontmatters:

```markdown
---
config:
  redirectTo: /about-me
---
```

</details>

#### options.preserveHash

Type: `boolean | Object`
Default: `false`

This option allows to preserve the hash while navigating from the source to the destination url.

For example if you redirect `/a` to `/b`, a visitor currently at
`/a#comments` will be redirected to `/b#comments`.

Note: this feature will optimistically try to leverage JavaScript to redirect
the user, as this is the only way to access the location hash. This will work
in most cases, but for some users with JavaScript disabled this means they
could remain stuck. When this happens it should fallback to the html meta
redirection (which cannot preserve the hashes due to its static nature).

<details><summary>Example</summary>

```javascript
const metalsmith = require('metalsmith')
const metalsmithRedirect = require('metalsmith-redirect')

metalsmith(__dirname).use(
  metalsmithRedirect({
    preserveHash: true,
  })
)
```

</details>

#### options.preserveHash.timeout

Type: `number`
Default: `1`

The number of second(s) after which the fallback should redirect the user
when hash preservation is enabled.

<details><summary>Example</summary>

```javascript
const metalsmith = require('metalsmith')
const metalsmithRedirect = require('metalsmith-redirect')

metalsmith(__dirname).use(
  metalsmithRedirect({
    preserveHash: { timeout: 2 },
  })
)
```

</details>

## FAQ

> Can you give some example of the redirection algorithm?

Let's consider the following configuration:

```json
{
  "plugins": {
    "metalsmith-redirect": {
      "redirections": {
        "foo": "hidden.html",
        "/foo/bar.html": "baz",
        "/github": "https://github.com/segmentio"
      }
    }
  }
}
```

The following redirections would be created:

| source             | destination                  |
| ------------------ | ---------------------------- |
| /foo/index.html    | /foo/hidden.html             |
| /foo/bar.html      | /foo/baz                     |
| /github/index.html | https://github.com/segmentio |
