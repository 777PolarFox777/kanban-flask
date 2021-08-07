/* eslint-disable global-require,import/no-extraneous-dependencies */
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
  ],
};
