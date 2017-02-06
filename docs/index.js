const path = require('path');
const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const sass = require('metalsmith-sass');
const inPlace = require('metalsmith-in-place');
const nunjucks = require('nunjucks');
const metadata = require('metalsmith-metadata');
const metalsmithMarkdown = require('metalsmith-markdownit')({
  html: true,
  typographer: true,
});
const importOnce = require('node-sass-import-once');
const scssToJson = require('scss-to-json');
const packageMeta = require('../package');

const env = nunjucks.configure([
  './docs/layouts',
  './src/templates',
  './docs/src'
], { watch: false });

env.addGlobal('asset_path', (filename) => {
  return (process.env.NODE_ENV === 'production' ? `/${packageMeta.name}/${packageMeta.version}/` : '/') + filename;
});

const metalsmith = Metalsmith(__dirname)
  .source('src')
  .metadata({
    colours: scssToJson(path.resolve(__dirname, '../src/scss/environment/settings/_colours.scss'))
  })
  .use(metadata({
    callouts: '_data/callouts.yaml'
  }))
  .use(metalsmithMarkdown)
  .use(sass({
    outputDir: 'css/',
    importer: importOnce,
    importOnce: {
      index: true,
      css: true
    },
    includePaths: [
      path.join(__dirname, '../src/scss')
    ],
  }))
  .use(layouts({
    engine: 'nunjucks',
    default: 'docs.njk',
    pattern: '**/*.{md,njk,html}',
    rename: true
  }))
  .use(inPlace({
    engine: 'nunjucks'
  }))
  .destination(`build/${require('../package').version}`)
;

module.exports = metalsmith;
