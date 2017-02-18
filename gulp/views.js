const gulp = require('gulp')
const plumber = require('gulp-plumber')
const pug = require('gulp-pug')

const paths = {
	src: './templates/index.pug',
	dest: './dist',
	watch: './templates/**/*.pug'
}
const config = {
	basedir: './templates',
	filename: 'index.html'
}

gulp.task('views:compile', () => {
	gulp.src(paths.src)
		.pipe(plumber())
		.pipe(pug(config))
		.pipe(gulp.dest(paths.dest))
})

gulp.task('views', ['views:compile'], () => {
	gulp.watch(paths.watch, ['views:compile']);
})

