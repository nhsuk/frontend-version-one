# NHS.UK Frontend (Alpha)

This project is an **alpha** version of reusable front-end components and styles
to be used for products and services that will live on NHS.UK.

## What's it for

The package is meant to have everything you need to start building websites or
services for NHS.UK.

It contains a [living style guide](https://nhsuk.github.io/frontend/) (powered by [Fractal](http://fractal.build/)).
It shows the usage of individual components and additional instructions.

## Development

Run local docs server:

```bash
npm run dev
```

Build frontend:

```bash
npm run build
```

Build docs for deployment:

```bash
npm run fractal:build
```

Build and deploy docs to GitHub pages:

```bash
npm run deploy
```

## Usage

It assumes that your front-end is a Node app with Nunjucks templates and Sass. Install this package with NPM:

```
npm install nhsuk/frontend --save
```

### Styles

Include individual styles in your Sass:

```scss
@import "nhsuk-frontend/dist/scss/environment/generic";
@import "nhsuk-frontend/dist/scss/environment/tools";
@import "nhsuk-frontend/dist/scss/units";
...
@import "nhsuk-frontend/dist/scss/components/button";
```

Import everything:

```scss
@import "nhsuk-frontend/dist/scss/nhsuk";
```

Include the compiled css in the head of your page:

```html
<link href="[your asset path]/nhsuk.css" media="screen" rel="stylesheet" type="text/css">
```

### Templates

Configure Nunjucks to add this package's template path to your Nunjucks environment:

 ```js
 const path = require('path');
const nunjucksEnv = nunjucks.configure([
  path.resolve(__dirname, '/app/views'),
  path.resolve(__dirname, '/node_modules/nhsuk-frontend/src/templates')
], {
  autoescape: true
})
```

Then extend your template from NHS.UK base template:

```jinja
{% extends 'nhsuk-base.njk' %}
```

Base template has a number of [blocks](https://mozilla.github.io/nunjucks/templating.html#block)
that can be overridden or extended from your template:

**Nunjucks blocks**

- `head` - wraps the inside of the whole `head` element
  - `head_title` - wraps `title` element
  - `head_cdn_prefetch` - wraps dns-prefetch `link` tags
  - `head_favicon` - wraps favicons and touch icons
  - `head_meta` - wraps various `meta` tags
    - `head_meta_opegraph` - reserved for OpenGraph `meta` tags
    - `head_meta_twitter` - reserved for Twitter `meta` tags
  - `head_stylesheets` - wraps stylesheets
  - `head_scripts` - wraps head scripts
    - `head_scripts_polyfills` - wraps head scripts polyfills (e.g. picturefill)
  - `head_tracking` - reserved for tracking scripts in the head
- `skiplinks` - wraps container with "skip to content" link, first element inside `body`
- `messages` - wraps cookie message container, above `site_header`, after `skiplinks`
- `content` - placeholder for main content, inside `main#content`
- `site_footer` - wraps site footer block, inside `body > footer`
 - `foot` - last placeholder before the end of `body` tag
