import normalize from './normalize'
import { dirname } from 'path'

/**
 * A Metalsmith plugin to create HTTP redirections.
 * @param {Object=} options - the source/destination couples to redirect from/to
 * @return {Function} - the Metalsmith plugin
 */
export default (options = {}) => {
  return (files, metalsmith, done) => {
    Object.entries(options).reduce((acc, [ source, destination ]) => {
      const normalizedSource = normalize(source)
        .appendHTMLIndexIfNeeded()
        .ensureHTML()
        .relativeTo('/')
        .value()
      const normalizedDestination = normalize(destination)
        .relativeTo(dirname(normalizedSource))
        .value()
      const filepath = normalizedSource.substr(1)
      const contents = new Buffer(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="robots" content="noindex">
            <meta http-equiv="refresh" content="0;url=${normalizedDestination}">
            <link rel="canonical" href="${normalizedDestination}">
            <script>window.location.replace('${normalizedDestination}');</script>
          </head>
          <body>This page has been moved to <a href="${normalizedDestination}">${normalizedDestination}</a></body>
        </html>
      `)
      return Object.assign(acc, { [filepath]: { contents } })
    }, files)
    return done()
  }
}
