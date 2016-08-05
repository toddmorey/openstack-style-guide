'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// BrowserSync isn't a gulp package, and needs to be loaded manually
var browserSync = require('browser-sync');
// define a variable that BrowserSync uses in it's function
var bs;
// command for reloading webpages using BrowserSync
var reload = browserSync.reload;

// webpack
var webpack = require('webpack');
var gutil = require("gulp-util");
var main_dir = process.cwd();

// netlify
var config = require('./netlify-config.js'),
    netlify = require('netlify');

// sass (css compliation)
var sass = require('gulp-sass');

// Webpack / Riot Configuration
var webpackOpts = {
  entry: main_dir + '/include',
  output: {
    path: main_dir + '/content/js/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ],
  module: {
    loaders: [
      { test: /\.tag$/, loader: 'tag' }
    ]
  }
};

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/**/*.*")
        .pipe(sass({includePaths: [
            'scss/**/',
            'bower_components/susy/sass']
          , errLogToConsole: true}))
        .pipe(gulp.dest("build/css"))
        .pipe(gulp.dest("content/css"))
        .pipe(browserSync.stream());
});

gulp.task('start-metalsmith', function () {
  var started = false;
  return $.nodemon({
    script: 'index.js'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  }).on('complete', function () {
    $.gutil.log('Hello world!');
    browserSync.reload();
  });
});

gulp.task('start-browserSync',['start-metalsmith'], function () {
  bs = browserSync({
    notify: true,
    // tunnel: '',
    server: {
      baseDir: 'build'
    }
  });
});

// webpack of JS assets
gulp.task('webpack', function (cb) {
    webpack(
        webpackOpts,
        function(err, stats) {
          if(err) throw new gutil.PluginError("webpack", err);
          gutil.log("[webpack]", stats.toString({
            // output options
        }));
        cb();
    });
});

// Watch content and templates to rebuild on change
gulp.task('watch', function () {
  gulp.watch(['riot-components/**/*.*'], ['webpack']);
  gulp.watch(['scss/**/*.*'], ['sass']);
  gulp.watch(['build/**/*.*'], reload);
});

// Deploy site to netlify
gulp.task('deploy', ['build-site'], function() {
  netlify.deploy({
    access_token: config.NETLIFY_ACCESS_TOKEN,
    site_id: config.NETLIFY_SITE_ID,
    dir: config.NETLIFY_SITE_DIR
  }, function(err, deploy) {
    if (err) { throw(err) }
  });
});

// Default task to start site and serve it
gulp.task('default', ['sass', 'start-browserSync', 'watch']);
