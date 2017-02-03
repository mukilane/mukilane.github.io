/* Build Process */
// Clean Amp > Closure Compile > Jekyll > Copy amp > sw-precache 

const gulp = require('gulp');
const exec = require('child_process').exec;
const gutil = require('gulp-util');
const del = require('del');
const compiler = require('google-closure-compiler-js').gulp();
const spawn = require('child_process').spawn;

// Clean the amp folder to prevent dulpication during Jekyll build
gulp.task('clean', () => {
	return del(['amp/**/*']);
});

// Compile JS using Google Closure Compiler
gulp.task('compile', ['clean'], () => {
  return gulp.src('./scripts/main.js', {base: './'})
      .pipe(compiler({
          compilationLevel: 'WHITESPACE_ONLY',
          warningLevel: 'DEFAULT',
          jsOutputFile: 'main.min.js',
          createSourceMap: true,
          angularPass: true
        }))
      .pipe(gulp.dest('./scripts'));
});

// Jekyll Build
gulp.task('jekyll', ['compile'], (callback) => {
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

// Add untracked files 
gulp.task('add', ['generate-sw'], (callback) => {
	exec('git add -A',  (err, stdout, stderr) => {
		callback(err);
	});
});

// Commit files 
gulp.task('commit', ['add'], (callback) => {
	exec('git commit',  (err, stdout, stderr) => {
		gutil.log(stdout);
		callback(err);
	});
});

// Push to origin
gulp.task('deploy', ['commit'], (callback) => {
	exec('git push',  (err, stdout, stderr) => {
		gutil.log(stdout);
		callback(err);
	});
});
// Tasks run sequentially using dependencies
// Reminder: Update to gulp.series on 4.x
gulp.task('default', ['deploy']);

// Deploy amp-ed files
gulp.task('ampdeploy', (callback) => {
	process.chdir('./amp/');
	exec('git add -A && git commit && git push', (err, stdout, stderr) => {
		gutil.log(stdout);
		callback(err);
	});
});