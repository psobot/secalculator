var _ = require('lodash'),
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    path = require('path'),
    sass = require('gulp-sass'),
    haml = require('gulp-haml'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');

var jsGlob = path.join(__dirname, 'src', 'js', '**', '*.js');
var vendorJs = [
  ['bower_components', 'd3', 'd3.js'],
  ['bower_components', 'jquery', 'dist', 'jquery.js'],
];

var stylesGlob = path.join(__dirname, 'src', 'styles', '**', '*.sass');
var hamlGlob = path.join(__dirname, 'src', '*.haml');
var destination = path.join(__dirname, 'public');

gulp.task('js', function() {
  return gulp
    .src(jsGlob)
    .pipe(sourcemaps.init())
    .pipe(concat('application.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destination));
});

gulp.task('styles', function () {
  return gulp
    .src(stylesGlob)
    .pipe(concat('styles.css'))
    .pipe(sass())
    .pipe(gulp.dest(destination));
});

gulp.task('haml', function () {
  return gulp
    .src(hamlGlob)
    .pipe(haml())
    .pipe(gulp.dest(destination));
});

gulp.task('vendor-js', function() {
  return gulp
    .src(_.map(vendorJs, function(pathComponents) {
      return path.join.apply(null, [__dirname].concat(pathComponents));
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destination));
});

gulp.task('watch', function () {
  gulp.watch(jsGlob, ['js']);
  gulp.watch(vendorJs, ['vendor-js']);
  gulp.watch(stylesGlob, ['styles']);
  gulp.watch(hamlGlob, ['haml']);
});

gulp.task('build', ['js', 'vendor-js', 'styles', 'haml']);