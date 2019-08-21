const _ = require('lodash')

module.exports = (files, options = {}) => {
  const getRedirectFrom = file =>
    _.get(file, options.redirectFrom || 'redirectFrom', null)
  const getRedirectTo = file =>
    _.get(file, options.redirectTo || 'redirectTo', null)

  return Object.entries(files).reduce((acc, [filepath, file]) => {
    const redirectFrom = getRedirectFrom(file)
    if (redirectFrom) {
      for (const r of _.castArray(redirectFrom)) {
        acc.push({ source: r, destination: filepath })
      }
    }

    const redirectTo = getRedirectTo(file)
    if (redirectTo) {
      acc.push({ source: filepath, destination: redirectTo })
      delete files[filepath]
    }

    return acc
  }, [])
}
