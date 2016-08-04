import { extname, join } from 'path'

/**
 * Return true if a string represents a directory. The results is determined
 * based on the absence of extension.
 * @param {String} toTest
 * @return {Boolean} true if a directory, false otherwise
 */
const isDirectory = (toTest) => extname(toTest) === ''

/**
 * Return true if a string represents a path to a HTML file. The results is
 * determined based on the '.html' extension.
 * @param {String} toTest
 * @return {Boolean} true if a HTML file, false otherwise
 */
const isHTML = (toTest) => extname(toTest) === '.html'

/**
 * Return true if a string represents is absolute (either as a path or as a
 * URL).
 * @param {String} toTest
 * @return {Boolean} true if an absolute path
 */
const isAbsolute = (toTest) => /^(?:\/|\\|(?:http|https|ftp):\/\/)/.test(toTest)

/**
 * Wrap a path and return an object which exposes methods in order to manipulate
 * it.
 * @param {String} wrappedPath The path to normalize
 */
export default (wrappedPath) => ({
  /**
   * Return the wrapped path (handle Windows style path).
   * @return {String} The wrapped path
   */
  value () {
    return wrappedPath.replace(/\\/g, '/')
  },

  /**
   * Append a HTML index (index.html) to the wrapped path if it is a
   * directory.
   */
  appendHTMLIndexIfNeeded () {
    if (isDirectory(wrappedPath)) {
      // Save the prefix (http:/, ftp:/, ...) in order to avoid issues with
      // join()
      var prefix = ''
      var idx = wrappedPath.indexOf('/')
      if (idx > 0) {
        prefix = wrappedPath.substring(0, idx + 1)
        wrappedPath = wrappedPath.substring(idx + 1)
      }
      wrappedPath = prefix + join(wrappedPath, 'index.html')
    }
    return this
  },

  /**
   * Ensure that the wrapped path ends with a HTML file.
   * @throws Will throw an exception if the wrapped path doesn't end with a
   * HTML file
   */
  ensureHTML () {
    if (!isHTML(wrappedPath)) {
      throw new Error(`"${wrappedPath}" is not a valid HTML path`)
    }
    return this
  },

  /**
   * Make the wrapped path relative to the given directory.
   * @param {String} dir If not given, will consider relative to the root
   * directory
   */
  relativeTo (dir) {
    if (!isAbsolute(wrappedPath)) {
      wrappedPath = join(dir, wrappedPath)
    }
    return this
  }
})
