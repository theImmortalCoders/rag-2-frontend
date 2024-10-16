/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      screens: {
        '2xs': '375px',
        xs: '475px',
        mds: '799px',
        mdl: '910px',
        '3xl': '1760px',
      },
      colors: {
        mainGray: '#353535',
        lightGray: '#5D5D5D',
        darkGray: '#3C3D42',
        mainOrange: '#FF6000',
        lightOragne: '#FFA559',
        mainCreme: '#FFE6C7',
      },
      height: {
        navbar: '80px',
      },
      padding: {
        navbar: '80px',
      },
      minHeight: {
        all: 'calc(100vh - 80px)',
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
      },
      lineHeight: {
        '2xs': '0.8125rem',
        '3xs': '0.625rem',
      },
      boxShadow: {
        navbarShadow: '0px 1px 7px 2px rgba(255, 96, 0, 1)',
        userInfoShadow: '-1px 1px 7px 2px rgba(255, 96, 0, 1)',
        footerShadow: 'inset 0px 4px 25px -8px rgba(93, 93, 93, 1)',
        sideMenuShadow: '-5px 7px 25px -7px rgba(93, 93, 93, 1)',
      },
      animation: {
        typewriter21: 'typewriter 3s steps(21) forwards',
        caret21:
          'typewriter 3s steps(21) forwards, blink 2s steps(21) infinite 3s',
      },
      keyframes: {
        typewriter: {
          to: { left: '100%' },
        },
        blink: {
          '0%': { opacity: '0' },
          '0.1%': { opacity: '1' },
          '50%': { opacity: '1' },
          '50.1%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.custom-input': {
          '@apply border-[1px] border-mainCreme rounded-md px-2 py-1 bg-mainGray text-sm xs:text-base text-mainCreme transition-all ease-in-out duration-700 focus:outline-none focus:border-mainOrange':
            {},
        },
        '.side-menu-right-button': {
          '@apply flex flex-col shadow-sideMenuShadow z-20 absolute transition-all ease-in-out duration-700 p-2 items-center justify-center bg-lightGray font-mono font-bold border-r-2 border-mainOrange hover:border-green-500':
            {},
        },
        '.side-menu-left-button': {
          '@apply flex flex-col shadow-sideMenuShadow z-20 absolute transition-all ease-in-out duration-700 p-2 items-center justify-center bg-lightGray font-mono font-bold border-l-2 border-mainOrange hover:border-green-500':
            {},
        },
        '.side-menu-container': {
          '@apply flex flex-col shadow-sideMenuShadow z-20 absolute transition-all ease-in-out duration-700':
            {},
        },
      });
    },
  ],
};
