const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const importOnce = require('node-sass-import-once');
const rimraf = require('gulp-rimraf');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');


gulp.task('clean', () => {
  return gulp.src('dist', { read: false })
    .pipe(rimraf());
});

gulp.task('build', ['clean'], () => {
  return gulp.src('src/scss/**.scss')
    .pipe(sass({
      importer: importOnce,
      importOnce: {
        index: true,
        css: true
      }
    }).on('error', (err) => {
      sass.logError.call(this, err);
      process.exit(1);
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(path.resolve(__dirname, 'dist/')))
  ;
});

gulp.task('default', ['clean', 'build']);
