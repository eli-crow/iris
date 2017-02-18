const gulp = require('gulp')
require('require-directory')(module, './gulp')
gulp.task('default', ['scripts', 'styles', 'views', 'serve'])