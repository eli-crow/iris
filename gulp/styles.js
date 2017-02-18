const gulp = require('gulp')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')

const paths = {
	src: './scss/**/*.scss',
	dest: './dist',
	watch: ['./scss/**/*.scss', './scss/*.scss']
}
const config = {

}

gulp.task('styles:sass', () => {
	gulp.src(paths.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass(config))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.dest))
})

gulp.task('styles',['styles:sass'], () => {
	gulp.watch(paths.src, ['styles:sass'])
})