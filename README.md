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
npm run build:docs
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

- `head` - contains the whole `head` element
  - `head_title_content` - contains `title` element content
  - `head_content` - wraps main content for `head` element
  - `head_stylesheets` - wraps stylesheet declarations
- `body` - contains the whole `body` element
  - `body_skiplinks` - wraps container with "skip to content" link (first element inside `body`)
  - `body_notifications` - wraps cookie message container (above `site_header`, after `skiplinks`)
  - `body_site_header` - wraps site header
  - `body_site_header_service_title` - wraps the service title
  - `body_main_content` - contains main content (inside `main#content`)
  - `body_footer` - wraps site footer container (inside `body > footer`)
    - `body_footer_content` - contains content inside site footer
