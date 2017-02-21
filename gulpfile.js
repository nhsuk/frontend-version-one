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
  srcScss: `${__dirname}/src/scss`,
  srcImages: `${__dirname}/src/assets/images`,
  dist: `${__dirname}/dist`,
  distAssets: `${__dirname}/dist/assets`,
  distScss: `${__dirname}/dist/scss`,
  fractalScss: `${__dirname}/fractal/theme/scss`,
  fractalAssets: `${__dirname}/fractal/theme/assets`,
}

gulp.task('clean', () => {
  return runSequence('clean:dist', 'clean:fractal')
})

gulp.task('clean:dist', () => {
  return del([`${paths.dist}/`])
})

gulp.task('clean:fractal', () => {
  return del([`${paths.fractalAssets}/*.css`])
})

gulp.task('copy:styles:dist', () => {
  return gulp.src([
    `${paths.srcScss}/**/*.scss`,
    `!${paths.srcScss}/components/**/*.scss`
  ])
    .pipe(gulp.dest(paths.distScss))
})

gulp.task('copy:styles:components:dist', () => {
  return gulp.src(`${paths.srcScss}/components/**/*.scss`)
    .pipe(flatten())
    .pipe(gulp.dest(`${paths.distScss}/components`))
})

// Copy images
gulp.task('copy:images', () => {
  return gulp.src(`${paths.srcImages}/**/*`)
    .pipe(gulp.dest(`${paths.distAssets}/images`))
})

gulp.task('inject:styles:dist', () => {
  return gulp.src(`${paths.distScss}/components/_index.scss`)
    .pipe(inject(gulp.src([
      `${paths.distScss}/components/*.scss`,
      `!${paths.distScss}/components/_index.scss`
    ]), {
      starttag: '//inject:{{ext}}',
      endtag: '//endinject',
      relative: true,
      transform: (filePath) => `@import "${filePath}";`
    }))
    .pipe(gulp.dest(`${paths.distScss}/components`))
})

gulp.task('compile:styles:fractal', () => {
  return gulp.src(`${paths.fractalScss}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${paths.fractalAssets}`))
})

gulp.task('compile:styles:dist', () => {
  return gulp.src(`${paths.distScss}/*.scss`)
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
    .pipe(gulp.dest(`${paths.distAssets}/css`))
})

gulp.task('build:fractal', cb => {
  runSequence('clean:fractal', 'compile:styles:fractal', cb)
})

gulp.task('build:dist', cb => {
  runSequence(
    'clean:dist',
    ['copy:styles:dist', 'copy:styles:components:dist', 'copy:images'],
    'inject:styles:dist', 'compile:styles:dist',
    cb
  )
})

gulp.task('build', cb => {
  runSequence('build:fractal', 'build:dist', cb)
})

gulp.task('watch:styles', function () {
  return gulp.watch(
    [
      `${paths.srcScss}/**/*.scss`,
      `${paths.fractalScss}/**/*.scss`
    ],
    ['build']
  )
})

gulp.task('default', ['build'])
