const path = require('path')
const fractal = require('@frctl/fractal').create()
const packageMeta = require('./package')
const nhsCustomTheme = require('./fractal/theme')

const buildPathPrefix = (process.env.NODE_ENV === 'production' ? `/${packageMeta.version}` : '')
const paths = {
  dist: `${__dirname}/dist`,
  src: `${__dirname}/src`
}

// Markdown config
const mdAbbr = require('markdown-it-abbr')
const mdFootnote = require('markdown-it-footnote')
const md = require('markdown-it')({
  html: true,
  xhtmlOut: true,
  typographer: true,
})
  .use(mdAbbr)
  .use(mdFootnote)

// Nunjucks config
const nunjucks = require('@frctl/nunjucks')({
  globals: {
    asset_path: filename => `${buildPathPrefix}/${filename}`
  },
  paths: ['src/templates'],
  filters: {
    markdown(str) {
      return md.render(str)
    },
    markdownInline(str) {
      return md.renderInline(str)
    },
    slugify(str) {
      return str.toLowerCase().replace(/[^\w]+/g, '')
    },
    stringify() {
      return JSON.stringify(this, null, 2)
    },
  }
})

// Project config
fractal.set('project.title', 'NHS.UK Frontend')

// Components config
fractal.components.engine(nunjucks)
fractal.components.set('default.preview', '@preview')
fractal.components.set('default.status', null);
fractal.components.set('ext', '.njk')
fractal.components.set('path', `${paths.src}/scss/components`)

// Docs config
fractal.docs.engine(nunjucks)
fractal.docs.set('ext', '.md')
fractal.docs.set('path', `${paths.src}/docs`)

// Web UI config
fractal.web.theme(nhsCustomTheme)
fractal.web.set('static.path', paths.dist);
fractal.web.set('builder.dest', path.join(__dirname, `build`, buildPathPrefix));

module.exports = fractal
