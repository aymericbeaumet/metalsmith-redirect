const path = require('path')

function isDirectory(url) {
  return path.extname(url) === ''
}

function isHTML(url) {
  return path.extname(url) === '.html'
}

function isAbsolute(url) {
  return /^(?:\/|\\|(?:https?|ftp):\/\/)/.test(url)
}

module.exports = wrappedPath => {
  return {
    get() {
      // Handle Windows style path
      wrappedPath = wrappedPath.replace(/\\/g, '/')

      return wrappedPath
    },

    appendHTMLIndexIfNeeded() {
      if (isDirectory(wrappedPath)) {
        // Save the prefix (http:/, ftp:/, ...) in order to avoid issues with
        // path.join()
        let prefix = ''
        const idx = wrappedPath.indexOf('/')
        if (idx > 0) {
          prefix = wrappedPath.slice(0, idx + 1)
          wrappedPath = wrappedPath.slice(idx + 1)
        }

        wrappedPath = prefix + path.join(wrappedPath, 'index.html')
      }

      return this
    },

    ensureHTML() {
      if (!isHTML(wrappedPath)) {
        throw new Error(`"${wrappedPath}" is not a valid HTML path`)
      }

      return this
    },

    relativeTo(filepath) {
      if (isAbsolute(wrappedPath)) {
        return this
      }

      const dir =
        path.extname(filepath) === '' ? filepath : path.dirname(filepath)
      wrappedPath = path.join(dir, wrappedPath)

      return this
    },
  }
}
