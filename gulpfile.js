/* Build Process */
// Clean Amp > Jekyll > Copy amp > sw-precache 

const gulp = require('gulp');
const exec = require('child_process').exec;
const gutil = require('gulp-util');
const del = require('del');
const git = require('gulp-git')

// Clean the amp folder to prevent dulpication during Jekyll build
gulp.task('clean', (cb) => {
	return del(['amp/**/*']);
});

// Jekyll Build
gulp.task('jekyll', ['clean'],(callback) => {
	exec('jekyll build', (err, stdout, stderr) => {
		gutil.log(stderr);
		gutil.log(stdout);
		callback(err);
	});
});

// Copy generated amp files to the source
// Done because of Github's restriction on custom plugins
gulp.task('amp', ['jekyll'], () => {
	gulp.src('_site/amp/blog/**/*.html').pipe(gulp.dest('amp'));
});

// Generate Service worker using sw-precache
gulp.task('generate-sw', ['amp'], (callback) => {
	exec('sw-precache --config=sw-precache-config.js', (err, stdout, stderr) => {
		gutil.log(stdout);
		callback(err);
	});
});


gulp.task('add', (callback) => {
	exec('git add -A',  (err, stdout, stderr) => {
		callback(err);
	});
});

// Deploy to Github
gulp.task('commit', ['add'], (callback) => {
	exec('git commit',  (err, stdout, stderr) => {
		callback(err);
	});
});

gulp.task('deploy', ['commit'], (callback) => {
	exec('git push',  (err, stdout, stderr) => {
		callback(err);
	});
});
// Tasks run sequentially using dependencies
// Reminder: Update to gulp.series on 4.x
gulp.task('default', ['generate-sw']);