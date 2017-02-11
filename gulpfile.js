const path = require('path')
const gulp = require('gulp')
const runSequence = require('run-sequence')
const del = require('del')
const sass = require('gulp-sass')
const flatten = require('gulp-flatten')
const importOnce = require('node-sass-import-once')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const inject = require('gulp-inject')

// Paths
const paths = {
  src: `${__dirname}/src`,
  dist: `${__dirname}/dist`,
  fractalScss: `${__dirname}/fractal/theme/scss`,
  fractalCss: `${__dirname}/fractal/theme/css`,
}

gulp.task('clean', () => {
  return runSequence('clean:dist', 'clean:fractal')
})

gulp.task('clean:dist', () => {
  return del([`${paths.dist}/`])
})

gulp.task('clean:fractal', () => {
  return del([`${paths.fractalCss}/`])
})

gulp.task('copy:styles:dist', () => {
  return gulp.src(`${paths.src}/scss/**/*.scss`)
    .pipe(gulp.dest(`${paths.dist}/scss`))
})

gulp.task('copy:styles:components:dist', () => {
  return gulp.src(`${paths.src}/scss/components/**/*.scss`)
    .pipe(flatten())
    .pipe(gulp.dest(`${paths.dist}/scss/components`))
})

gulp.task('inject:styles:dist', () => {
  return gulp.src(`${paths.dist}/scss/components/_index.scss`)
    .pipe(inject(gulp.src([
      `${paths.dist}/scss/components/*.scss`,
      `!${paths.dist}/scss/components/_index.scss`
    ]), {
      starttag: '//inject:{{ext}}',
      endtag: '//endinject',
      relative: true,
      transform: (filePath) => `@import "${filePath}";`
    }))
    .pipe(gulp.dest(`${paths.dist}/scss/components`))
})

gulp.task('compile:styles:fractal', () => {
  return gulp.src(`${paths.fractalScss}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.fractalCss))
})

gulp.task('compile:styles:dist', () => {
  return gulp.src(`${paths.dist}/scss/*.scss`)
    .pipe(sass({
      importer: importOnce,
      importOnce: {
        index: true,
        css: true
      }
    }).on('error', (err) => {
      sass.logError.call(this, err)
      process.exit(1)
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(`${paths.dist}/css`))
})

gulp.task('build:fractal', cb => {
  runSequence('clean:fractal', 'compile:styles:fractal', cb)
})

gulp.task('build:dist', cb => {
  runSequence('clean:dist', ['copy:styles:dist', 'copy:styles:components:dist'], 'inject:styles:dist', 'compile:styles:dist', cb)
})

gulp.task('build', cb => {
  runSequence('build:fractal', 'build:dist', cb)
})

gulp.task('watch:styles', function () {
  return gulp.watch(
    [
      paths.src + '/**/*.scss',
      paths.fractalScss + '/**/*.scss'
    ],
    ['build']
  )
})

gulp.task('default', ['build'])
