const gulp = require('gulp')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')
const base64 = require('gulp-base64')

const paths = {
	scss: {
		src: ['./scss/**/*.scss'],
		dest: './dist',
		watch: ['./scss/**/*.scss', './scss/*.scss'],
	}
}
const sassConfig = {

}
const base64Config = {

}

gulp.task('styles:sass', () => {
	return gulp.src(paths.scss.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass(sassConfig))
		.pipe(base64(base64Config))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.scss.dest))
})

gulp.task('styles', ['styles:sass'], () => {
	gulp.watch(paths.scss.src, ['styles:sass'])
})