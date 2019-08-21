const path = require('path')
const _ = require('lodash')
const normalize = require('./lib/normalize')
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
      ? createRedirectionsFromArg(options.redirections || null)
      : []
    const frontmattersRedirections = options.frontmatter
      ? createRedirectionsFromFrontmatters(files, options.frontmatter)
      : []

    for (const { source, destination } of [
      ...argRedirections,
      ...frontmattersRedirections,
    ]) {
      // Normalize the source and the destination
      const normalizedSource = normalize(source)
        .appendHTMLIndexIfNeeded()
        .ensureHTML()
        .relativeTo('/')
        .get()
      const normalizedDestination = normalize(destination)
        .relativeTo(path.dirname(normalizedSource))
        .get()

      // Compute the filepath
      const filepath = normalizedSource.substr(1)

      // Render the view
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

      // Boom
      files[filepath] = { contents }
    }

    done()
  }
}
