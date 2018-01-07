/* Build Process 
1. Clean amp folder to avoid replication during build
2. Compile the js files using Google Closure Compiler
3. Jekyll build
4. Copy the generated amp files back to the amp/ folder
5. Generate service worker using sw-precache
6. Add all unwatched files to git and commmit
7. Push to source (mukilane/mukilane.github.io)
8. Upload an index of posts to firebase for use in search
9. Deploy the generated amp files to separate repository (mukilane/amp)
*/

const gulp = require('gulp');
const exec = require('child_process').exec;
const gutil = require('gulp-util');
const del = require('del');
const compiler = require('google-closure-compiler-js').gulp();
const spawn = require('child_process').spawn;
const ngAnnotate = require('gulp-ng-annotate');
const replace = require('gulp-replace');
const concat = require('gulp-concat');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const append = require('gulp-append');

// Browserify
gulp.task('browserify', (callback) => {
	exec('browserify scripts/vendor.module.js -o scripts/vendor.js', (err, stdout, stderr) => {
		gutil.log(stderr);
		gutil.log(stdout);
		callback(err);
	});
});

// Bundle
gulp.task('bundle', ['browserify'], () => {
	gulp.src([
		'./scripts/angular/app.js',
		'./scripts/angular/*.ctrl.js',
		'./scripts/angular/directives.js',
		'./scripts/angular/factories.js',
		'./scripts/angular/serviceworker.js'
	])
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./scripts'));
	gulp.src([
		'./scripts/ApiAi.min.js',
		'./scripts/pjax-standalone.min.js',
		'./scripts/vendor.js'
	])
		.pipe(concat('vendor.bundle.js'))
		.pipe(gulp.dest('./scripts/'))
});

// Compile JS using Google Closure Compiler 
// Using ng-Annotate to annotate angular dependencies
gulp.task('compile', ['bundle'], () => {
	return gulp.src('./scripts/main.js', { base: './' })
		.pipe(ngAnnotate())
		.pipe(replace(/["']ngInject["'];*/g, ""))
		.pipe(compiler({
			compilationLevel: 'SIMPLE',
			warningLevel: 'DEFAULT',
			jsOutputFile: 'main.bundle.js',
			createSourceMap: true
		}))
		.pipe(gulp.dest('./scripts'));
});

// Clean the amp folder to prevent dulpication during Jekyll build
gulp.task('clean', ['compile'], () => {
	return del([
		'amp/**/*',
		'scripts/vendor.js'
	]);
});

// Jekyll Build
gulp.task('jekyll', ['clean'], (callback) => {
	exec('bundle exec jekyll build', (err, stdout, stderr) => {
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

// Add untracked files 
gulp.task('commit', ['generate-sw'], (callback) => {
	exec('git add -A && git commit', (err, stdout, stderr) => {
		gutil.log(stdout);
		callback(err);
	});
});

// Push to origin
gulp.task('push', ['commit'], (callback) => {
	exec('git push', (err, stdout, stderr) => {
		gutil.log(stdout);
		callback(err);
	});
});

// Upload index of posts to Firebase database
// Task now moved to Travis
gulp.task('fireDB', (callback) => {
	exec("firebase database:set /data/posts _site/assets/posts.json --confirm", (err, stdout, stderr) => {
		gutil.log(stdout);
		gutil.log(stderr);
		callback(err);
	});
});

// Tasks run sequentially using dependencies
// Reminder: Update to gulp.series on 4.x
gulp.task('default', ['push', 'ampdeploy']);

// Deploy amp-ed files to separate repository
gulp.task('ampdeploy', (callback) => {
	// Check if any new files are generated
	exec('cd amp && git status --porcelain', (err, stdout, stderr) => {
		if (err) {
			exec('git add -A && git commit && git push', (e, sOut, sErr) => {
				gutil.log(sOut);
				callback(e);
			})
		}
		gutil.log("Nothing to commit in amp");
		callback(err);
	});
});