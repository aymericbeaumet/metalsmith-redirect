const test = require('ava')
const htmlparser2 = require('htmlparser2')
const metalsmithRedirect = require('..')

function isValidHTML(html) {
  try {
    const parser = new htmlparser2.Parser()
    parser.write(html)
    parser.end()
  } catch (error) {
    return false
  }

  return true
}

test.cb('metalsmith-redirect should default to no redirections', t => {
  t.plan(1)
  const plugin = metalsmithRedirect()
  const files = {}
  plugin(files, null, () => {
    t.is(Object.keys(files).length, 0)
    t.end()
  })
})

test.cb(
  'metalsmith-redirect should use the redirections passed as the options',
  t => {
    t.plan(3)
    const plugin = metalsmithRedirect({ redirections: { a: 'b' } })
    const files = {}
    plugin(files, null, () => {
      t.is(Object.keys(files).length, 1)
      const contents = files['a/index.html'].contents.toString()
      t.true(isValidHTML(contents))
      t.is(
        contents,
        `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0;url=/a/b">
    <link rel="canonical" href="/a/b">
    <script>window.location.replace('/a/b');</script>
  </head>
  <body>This page has been moved to <a href="/a/b">/a/b</a></body>
</html>
`
      )
      t.end()
    })
  }
)

test.cb('metalsmith-redirect should escape the urls', t => {
  t.plan(3)
  const plugin = metalsmithRedirect({ redirections: { a: `'"'"` } })
  const files = {}
  plugin(files, null, () => {
    t.is(Object.keys(files).length, 1)
    const contents = files['a/index.html'].contents.toString()
    t.true(isValidHTML(contents))
    t.is(
      contents,
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0;url=/a/'\\"'\\"">
    <link rel="canonical" href="/a/'\\"'\\"">
    <script>window.location.replace('/a/\\'"\\'"');</script>
  </head>
  <body>This page has been moved to <a href="/a/'\\"'\\"">/a/'"'"</a></body>
</html>
`
    )
    t.end()
  })
})

test.cb('metalsmith-redirect should support to preserve the hash', t => {
  t.plan(3)
  const plugin = metalsmithRedirect({
    redirections: { a: 'b' },
    preserveHash: true,
  })
  const files = {}
  plugin(files, null, () => {
    t.is(Object.keys(files).length, 1)
    const contents = files['a/index.html'].contents.toString()
    t.true(isValidHTML(contents))
    t.is(
      contents,
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="1;url=/a/b">
    <link rel="canonical" href="/a/b">
    <script>window.location.replace('/a/b' + window.location.hash);</script>
  </head>
  <body>This page has been moved to <a href="/a/b">/a/b</a></body>
</html>
`
    )
    t.end()
  })
})

test.cb(
  'metalsmith-redirect should support to preserve the hash with a custom timeout',
  t => {
    t.plan(3)
    const plugin = metalsmithRedirect({
      redirections: { a: 'b' },
      preserveHash: { timeout: 3 },
    })
    const files = {}
    plugin(files, null, () => {
      t.is(Object.keys(files).length, 1)
      const contents = files['a/index.html'].contents.toString()
      t.true(isValidHTML(contents))
      t.is(
        contents,
        `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="3;url=/a/b">
    <link rel="canonical" href="/a/b">
    <script>window.location.replace('/a/b' + window.location.hash);</script>
  </head>
  <body>This page has been moved to <a href="/a/b">/a/b</a></body>
</html>
`
      )
      t.end()
    })
  }
)

test.cb(
  'metalsmith-redirect should support redirectFrom as a relative url string',
  t => {
    t.plan(3)
    const plugin = metalsmithRedirect({ frontmatter: true })
    const files = {
      about: {
        redirectFrom: 'about-bar',
      },
    }
    plugin(files, null, () => {
      t.is(Object.keys(files).length, 2)
      t.true('about' in files)
      t.true(
        files['about/about-bar/index.html'].contents
          .toString()
          .includes('href="/about"')
      )
      t.end()
    })
  }
)

test.cb(
  'metalsmith-redirect should support redirectFrom as an absolute url string',
  t => {
    t.plan(3)
    const plugin = metalsmithRedirect({ frontmatter: true })
    const files = {
      about: {
        redirectFrom: '/about-bar',
      },
    }
    plugin(files, null, () => {
      t.is(Object.keys(files).length, 2)
      t.true('about' in files)
      t.true(
        files['about-bar/index.html'].contents
          .toString()
          .includes('href="/about"')
      )
      t.end()
    })
  }
)

test.cb(
  'metalsmith-redirect should support redirectFrom as an url array',
  t => {
    t.plan(4)
    const plugin = metalsmithRedirect({ frontmatter: true })
    const files = {
      about: {
        redirectFrom: ['/about-bar', '/about-foo'],
      },
    }
    plugin(files, null, () => {
      t.is(Object.keys(files).length, 3)
      t.true('about' in files)
      t.true(
        files['about-bar/index.html'].contents
          .toString()
          .includes('href="/about"')
      )
      t.true(
        files['about-foo/index.html'].contents
          .toString()
          .includes('href="/about"')
      )
      t.end()
    })
  }
)

test.cb(
  'metalsmith-redirect should support redirectFrom with a custom key',
  t => {
    t.plan(3)
    const plugin = metalsmithRedirect({
      frontmatter: { redirectFrom: 'nested[0].from' },
    })
    const files = {
      about: {
        nested: [{ from: '/about-bar' }],
      },
    }
    plugin(files, null, () => {
      t.is(Object.keys(files).length, 2)
      t.true('about' in files)
      t.true(
        files['about-bar/index.html'].contents
          .toString()
          .includes('href="/about"')
      )
      t.end()
    })
  }
)

test.cb(
  'metalsmith-redirect should support redirectTo as a relative url string',
  t => {
    t.plan(2)
    const plugin = metalsmithRedirect({ frontmatter: true })
    const files = {
      'about-bar': {
        redirectTo: 'about',
      },
    }
    plugin(files, null, () => {
      t.is(Object.keys(files).length, 1)
      t.true(
        files['about-bar/index.html'].contents
          .toString()
          .includes('href="/about-bar/about"')
      )
      t.end()
    })
  }
)

test.cb(
  'metalsmith-redirect should support redirectTo as an absolute url string',
  t => {
    t.plan(2)
    const plugin = metalsmithRedirect({ frontmatter: true })
    const files = {
      'about-bar': {
        redirectTo: '/about',
      },
    }
    plugin(files, null, () => {
      t.is(Object.keys(files).length, 1)
      t.true(
        files['about-bar/index.html'].contents
          .toString()
          .includes('href="/about"')
      )
      t.end()
    })
  }
)

test.cb(
  'metalsmith-redirect should support redirectTo with a custom key',
  t => {
    t.plan(2)
    const plugin = metalsmithRedirect({
      frontmatter: { redirectTo: 'nested[0].to' },
    })
    const files = {
      'about-bar': {
        nested: [{ to: '/about' }],
      },
    }
    plugin(files, null, () => {
      t.is(Object.keys(files).length, 1)
      t.true(
        files['about-bar/index.html'].contents
          .toString()
          .includes('href="/about"')
      )
      t.end()
    })
  }
)
