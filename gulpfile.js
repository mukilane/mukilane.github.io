/* Build Process */

const gulp = require('gulp');

const child = require('child_process');
const gutil = require('gulp-util');

// Jekyll Build
gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build']);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  // jekyll.stderr.on('data', jekyllLogger);
});

// Copy generated amp files to the source
// Done because of Github's restriction on custom plugins
gulp.task('amp', () => {
	gulp.src('_site/amp/blog/**/*.html').pipe(gulp.dest('amp'));
});

gulp.task('default', ['jekyll','amp']);