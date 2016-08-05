var Metalsmith = require('metalsmith'),
    drafts = require('metalsmith-drafts'),
    markdown = require('metalsmith-markdown'),
    inplace = require('metalsmith-in-place'),
    layouts = require('metalsmith-layouts'),
    watch = require('metalsmith-watch'),
    nunjucks = require('nunjucks'),
    extender = require('./modules/metalsmith-extends.js'),
    permalinks = require('./modules/permalinks'),
    json = require('metalsmith-json-to-files'),
    define = require('metalsmith-define'),
    api = require('metalsmith-json-api'),
    msriot = require('./modules/metalsmith-riot.js'),
    images = require('metalsmith-project-images');

// removes caching from nunjucks
var env = nunjucks.configure({noCache : true});

var main_dir = process.cwd();

Metalsmith(__dirname)
  .source('./content')
  .destination('./build')
  .use(markdown())
  .use(images({
    pattern: 'iconography/*',
    imagesDirectory: 'svg-icons'
  }))  
  .use(permalinks({
      pattern: ':title',
      relative: false
    }))  
  .use(inplace('nunjucks'))
  .use(layouts('nunjucks'))
  .use(
    watch({
      paths: {
        "${source}/**/*.*": true,
        "layouts/**/*": "**/*"
      },
      livereload: false,
    })
  )
  .build(function(err) {
      if (err) {
          console.log(err);
      }
      else {
          console.log('Build completed');
      }
  });
