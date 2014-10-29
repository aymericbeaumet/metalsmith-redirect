var path = require('path');
var jade = require('jade');
var normalize = require('./normalize');

/**
 * A Metalsmith plugin to create HTTP redirections.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
module.exports = function plugin(options) {
  options = options || {};

  return function(files, metalsmith, done) {
    Object.keys(options).forEach(function (source) {
      var destination = options[source];

      // Normalize the source and the destination
      source = normalize(source)
        .appendHTMLIndexIfNeeded()
        .ensureHTML()
        .relativeTo('/')
        .get();
      destination = normalize(destination)
        .relativeTo(path.dirname(source))
        .get();

      // Render the view
      var rendered = jade.renderFile(path.join(__dirname, 'template.jade'), {
        pretty: true, // pretty HTML
        destination: destination
      });

      // Add the new file to the stream
      files[source.substr(1)] = {
        contents: rendered
      };
    });

    return done();
  };
};
