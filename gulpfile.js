var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var merge = require('merge-stream');

gulp.task('default', function() {
  var app = gulp.src('src/*.js');

  var templates = gulp.src('src/partials/*.html')
      .pipe(templateCache({module: 'angular-dropdown-multiselect'}));

  return merge(app, templates)
      .pipe(concat('angular-dropdown-multiselect.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
});
