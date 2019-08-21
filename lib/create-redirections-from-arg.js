module.exports = redirections => {
  return Object.entries(redirections).map(([source, destination]) => ({
    source,
    destination,
  }))
}
