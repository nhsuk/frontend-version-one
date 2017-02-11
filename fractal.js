const path = require('path')
const fractal = require('@frctl/fractal').create()
const packageMeta = require('./package')

const buildPathPrefix = (process.env.NODE_ENV === 'production' ? `/${packageMeta.version}` : '')
const paths = {
  dist: `${__dirname}/dist`,
  src: `${__dirname}/src`
}

// Appearance config
const customTheme = require('@frctl/mandelbrot')({
  lang: 'en-gb',
  styles: ['default', '/themes/nhsuk/css/theme.css'],
  nav: ['docs', 'components'],
  panels: ['html', 'context', 'resources', 'info']
})

customTheme.addStatic(path.join(__dirname, 'fractal/theme'), '/themes/nhsuk')

const mdAbbr = require('markdown-it-abbr')
const mdFootnote = require('markdown-it-footnote')
const md = require('markdown-it')({
  html: true,
  xhtmlOut: true,
  typographer: true,
})
  .use(mdAbbr)
  .use(mdFootnote)

const nunjucks = require('@frctl/nunjucks')({
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
fractal.components.set('ext', '.html')
fractal.components.set('path', `${paths.src}/scss/components`)

// Docs config
fractal.docs.engine(nunjucks)
fractal.docs.set('ext', '.md')
fractal.docs.set('path', `${paths.src}/docs`)

// Web UI config
fractal.web.theme(customTheme)
fractal.web.set('static.path', paths.dist);
fractal.web.set('builder.dest', path.join(__dirname, `build`, buildPathPrefix));

// Export config
module.exports = fractal
