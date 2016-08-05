
var basename = require('path').basename;
var debug = require('debug')('metalsmith-riot');
var dirname = require('path').dirname;
var extname = require('path').extname;
var riot = require('riot');


/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert markdown files.
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */

function plugin(options){


  options = options || {};
  var keys = options.keys || [];

  return function(files, metalsmith, done){
    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!isHTML(file)) return;
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = dir + '/' + html;

      debug('converting file: %s', file);

      require('../riot-components/sample.tag');

      var mytag = riot.compile(data.contents.toString());
      var str = riot.render(eval(mytag), data);

      data.contents = new Buffer(str);
      keys.forEach(function(key) {
        data[key] = marked(data[key], options);
      });

      delete files[file];
      files[html] = data;
    });
    done();
  };
}


/**
 * Check if a `file` is html.
 *
 * @param {String} file
 * @return {Boolean}
 */

function isHTML(file){
  return /\.html|\.htm/.test(extname(file));
}
