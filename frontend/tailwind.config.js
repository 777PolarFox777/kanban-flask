module.exports = {
  purge: [
    './src/**/*.tsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    spacing: {
      xsm: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      xmd: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      xxl: '4rem',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
