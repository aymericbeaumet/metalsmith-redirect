const normalize = require('./normalize')

module.exports = redirections => {
  return Object.entries(redirections).map(([source, destination]) => {
    const normalizedSource = normalize(source)
      .appendHTMLIndexIfNeeded()
      .ensureHTML()
      .relativeTo('/')
      .get()
    const normalizedDestination = normalize(destination)
      .relativeTo(normalizedSource)
      .get()
    return { normalizedSource, normalizedDestination }
  })
}
