const gulp = require('gulp')
const plumber = require('gulp-plumber')
const webpack = require('webpack-stream')	
const path = require('path');

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
	devtool: 'inline-source-map',
	entry: {
		app: "./src/entry.js"
	},
	output: {
		filename: "bundle.js",
	},
	module: {
		loaders: [
			{ test: /\.(glsl|frag|vert)$/, loader: 'shader'},
			{ test: /\.js$/, loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
				query: { presets: ['es2015']}
			}
		]
	},
	glsl: {
		chunkPath: path.resolve("./shaders/includes")
	}
}


gulp.task('scripts', () => {
	gulp.src(paths.src)
		.pipe(plumber())
		.pipe(webpack(config.webpack))
		.pipe(gulp.dest(paths.dest))
});