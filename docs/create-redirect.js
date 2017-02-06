#!/usr/bin/env node

const version = require('../package').version;
const fs = require('fs');
const path = require('path');

const template = `<meta http-equiv="refresh" content="0; url=${version}"/>`;

fs.writeFileSync(path.resolve(__dirname, 'build/index.html'), template);
