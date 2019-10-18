module.exports = {
  theme: {
   backgroundColor: theme => ({
     ...theme('colors'),
   }),
   maxWidth: theme => ({
     ...theme('spacing'),
   }),
    extend: {
      colors:{
        'dark': '#0b0b0b',
        'gold': '#e8c538',
        'green': '#00ff00',
        'grey': '#e8e8e8',
        'darkgrey': '#888888',
        'red': '#ff0000',
        'pink-shadow': '#eabd4810'
      },
    },
    fontFamily: {
      'alike': ['Alike', 'serif'],
      'lato': ['Lato', 'sans-serif'],
    },
    inset: {
      '0': '0',
      '1/2': '50%',
    },
    lineHeight: {
      'none': 1,
      'tight': 1.25,
      'snug': 1.375,
      'normal': 1.5,
      'relaxed': 1.625,
      'loose': 2,
      '8': '2rem',
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'xxl': '1480px',
    },
    spacing: {
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
      '20': '5rem',
      '24': '6rem',
      '32': '8rem',
      '40': '10rem',
      '48': '12rem',
      '56': '14rem',
      '64': '16rem',
      '80': '20rem',
      '120': '30rem',
      '144': '36rem',
      '240': '60rem',
      'px': '1px',
      '50px': '50px',
      '40px': '40px'
    },
  },
  variants: {},
  plugins: [],
}
