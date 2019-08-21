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
    const plugin = metalsmithRedirect({ a: 'b' })
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
  const plugin = metalsmithRedirect({ a: `'"'"` })
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
  const plugin = metalsmithRedirect({ a: 'b' }, { preserveHash: true })
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

test.cb('metalsmith-redirect should support redirectFrom', t => {
  t.plan(3)
  const plugin = metalsmithRedirect(null, { frontmatter: true })
  const files = {
    'about-me': {
      redirectFrom: 'about',
    },
  }
  plugin(files, null, () => {
    t.is(Object.keys(files).length, 2)
    const contents = files['about/index.html'].contents.toString()
    t.true(isValidHTML(contents))
    t.true(contents.includes('/about-me'))
    t.end()
  })
})

test.cb('metalsmith-redirect should support redirectTo', t => {
  t.plan(3)
  const plugin = metalsmithRedirect(null, { frontmatter: true })
  const files = {
    about: {
      redirectTo: 'about-me',
    },
  }
  plugin(files, null, () => {
    t.is(Object.keys(files).length, 1)
    const contents = files['about/index.html'].contents.toString()
    t.true(isValidHTML(contents))
    t.true(contents.includes('/about-me'))
    t.end()
  })
})
