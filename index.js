const _ = require('lodash')
const createRedirectionsFromArg = require('./lib/create-redirections-from-arg')
const createRedirectionsFromFrontmatters = require('./lib/create-redirections-from-frontmatters')

function escapeSingleQuotes(str) {
  return str.replace(/'/g, `\\'`)
}

function escapeDoubleQuotes(str) {
  return str.replace(/"/g, `\\"`)
}

module.exports = (options = {}) => {
  const preserveHash = options.preserveHash
    ? {
        timeout: 1,
        ...(_.isObject(options.preserveHash) ? options.preserveHash : {}),
      }
    : null

  return (files, _metalsmith, done) => {
    const argRedirections = options.redirections
      ? createRedirectionsFromArg(options.redirections)
      : []
    const frontmattersRedirections = options.frontmatter
      ? createRedirectionsFromFrontmatters(files, options.frontmatter)
      : []

    for (const { normalizedSource, normalizedDestination } of [
      ...argRedirections,
      ...frontmattersRedirections,
    ]) {
      const contents = Buffer.from(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="${
      preserveHash ? preserveHash.timeout : 0
    };url=${escapeDoubleQuotes(normalizedDestination)}">
    <link rel="canonical" href="${escapeDoubleQuotes(normalizedDestination)}">
    <script>window.location.replace('${escapeSingleQuotes(
      normalizedDestination
    )}'${preserveHash ? ' + window.location.hash' : ''});</script>
  </head>
  <body>This page has been moved to <a href="${escapeDoubleQuotes(
    normalizedDestination
  )}">${normalizedDestination}</a></body>
</html>
`)
      files[_.trimStart(normalizedSource, '/')] = { contents }
    }

    done()
  }
}
