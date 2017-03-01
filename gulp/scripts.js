const gulp = require('gulp')
const plumber = require('gulp-plumber')
const webpackStream = require('webpack-stream')	
const path = require('path')
const globals = require('../src/globals.js');

const paths = {
	src: './src/**/*.js',
	dest: './dist',
	watch: './src/**/*.js'
}

const config = {}

config.babel = {
	presets: ['es2015']
}

config.webpackStream = {
	watch: true,
	devtool: 'inline-source-map',

	entry: {
		app: "./src/entry.js"
	},

	output: {
		filename: "bundle.js",
	},

	plugins: [
		new webpackStream.webpack.DefinePlugin(globals),
	],

	module: {
		loaders: [
			{ test: /\.(glsl|frag|vert)$/, loader: 'shader'},
			{ test: /\.js$/, loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
				query: { presets: ['es2015']} }
		]
	},

	glsl: {
		chunkPath: path.resolve("./shaders/includes")
	}
}


gulp.task('scripts', () => {
	gulp.src(paths.src)
		.pipe(plumber())
		.pipe(webpackStream(config.webpackStream))
		.pipe(gulp.dest(paths.dest))
})