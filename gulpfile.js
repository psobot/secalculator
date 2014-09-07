var _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    tap = require('gulp-tap'),
    plumber = require('gulp-plumber');

var jsGlob = path.join(__dirname, 'src', 'js', '**', '*.js');
var vendorJs = [
  ['bower_components', 'd3', 'd3.js'],
  ['bower_components', 'jquery', 'dist', 'jquery.js'],
  ['bower_components', 'lodash', 'dist', 'lodash.js'],
  ['bower_components', 'bootstrap', 'dist', 'js', 'bootstrap.js'],
  ['bower_components', 'angular', 'angular.js'],
  ['bower_components', 'angular-fcsa-number', 'src', 'fcsaNumber.js'],
];

var stylesGlob = path.join(__dirname, 'src', 'styles', '**', '*.sass');
var vendorStyles = [
  ['bower_components', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'],
];

var imgGlob = path.join(__dirname, 'src', 'img', '*.*');
var htmlGlob = path.join(__dirname, 'src', '*.html');
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
    .pipe(concat('style.css'))
    .pipe(sass())
    .pipe(gulp.dest(destination));
});

gulp.task('img', function () {
  return gulp
    .src(imgGlob)
    .pipe(gulp.dest(destination));
});

gulp.task('html', function () {
  return gulp
    .src(htmlGlob)
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

gulp.task('vendor-styles', function () {
  return gulp
    .src(_.map(vendorStyles, function(pathComponents) {
      return path.join.apply(null, [__dirname].concat(pathComponents));
    }))
    .pipe(concat('vendor-style.css'))
    .pipe(gulp.dest(destination));
});

gulp.task('watch', function () {
  gulp.watch(jsGlob, ['js']);
  gulp.watch(vendorJs, ['vendor-js']);
  gulp.watch(stylesGlob, ['styles']);
  gulp.watch(vendorStyles, ['vendor-styles']);
  gulp.watch(htmlGlob, ['html']);
  gulp.watch(imgGlob, ['img']);
});

gulp.task('build', ['js', 'vendor-js', 'styles', 'vendor-styles', 'html', 'img']);