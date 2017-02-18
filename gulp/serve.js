const gulp = require('gulp')
const browserSync = require('browser-sync')

const paths = {
	watch: [
		'./dist/**/*',
		'./dist/*'
	]
}
const browserSyncConfig = {
	proxy: 'localhost:8888'
}

gulp.task('serve', () => {
	browserSync.init(paths.watch, browserSyncConfig)
})