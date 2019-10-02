const _ = require('lodash')
const normalize = require('./normalize')

module.exports = (files, options = {}) => {
  const getRedirectFrom = file =>
    _.get(file, options.redirectFrom || 'redirectFrom', null)
  const getRedirectTo = file =>
    _.get(file, options.redirectTo || 'redirectTo', null)

  return Object.entries(files).reduce((acc, [filepath, file]) => {
    const redirectFrom = getRedirectFrom(file)
    if (redirectFrom) {
      for (const source of _.castArray(redirectFrom)) {
        const normalizedDestination = normalize(filepath)
          .relativeTo('/')
          .get()
        const normalizedSource = normalize(source)
          .appendHTMLIndexIfNeeded()
          .ensureHTML()
          .relativeTo(normalizedDestination)
          .get()
        acc.push({ normalizedSource, normalizedDestination })
      }
    }

    const redirectTo = getRedirectTo(file)
    if (redirectTo) {
      const normalizedSource = normalize(filepath)
        .appendHTMLIndexIfNeeded()
        .ensureHTML()
        .relativeTo('/')
        .get()
      const normalizedDestination = normalize(redirectTo)
        .relativeTo(normalizedSource)
        .get()
      acc.push({ normalizedSource, normalizedDestination })
      delete files[filepath]
    }

    return acc
  }, [])
}
