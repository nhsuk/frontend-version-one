const styleguide = require('./');

styleguide
  .build((err) => {
    if (err) throw err;
    console.info('Build finished!');
  });
