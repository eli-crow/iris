const gulp = require('gulp')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const webpack = require('webpack-stream')	
const sourcemaps = require('gulp-sourcemaps')


const paths = {
	src: './src/**/*.js',
	dest: './dist',
	watch: './src/**/*.js'
}
const config = {}
config.babel = {
	presets: ['es2015']
}
config.webpack = {
	watch: true,
	entry: {
		app: "./src/entry.js"
	},
	output: {
		filename: "bundle.js",
	},
	module: {
		loaders: [
			{ test: /\.glsl$|\.frag$|\.vert$/, loader: 'webpack-glsl'}
		]
	}
}


gulp.task('scripts', () => {
	gulp.src(paths.src)
	  .pipe(plumber())
	  .pipe(webpack(config.webpack))
	  .pipe(sourcemaps.init())
	  .pipe(babel(config.babel))
	  .pipe(sourcemaps.write())
	  .pipe(gulp.dest(paths.dest))
});