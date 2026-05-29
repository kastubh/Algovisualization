export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211d',
        paper: '#f7f5ee',
        mint: '#2f9c7a',
        coral: '#e45f4f',
        gold: '#d6a437',
      },
      keyframes: {
        bob: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        mouth: {
          '0%, 100%': { transform: 'scaleY(0.65)' },
          '50%': { transform: 'scaleY(1.15)' },
        },
      },
      animation: {
        bob: 'bob 1.8s ease-in-out infinite',
        mouth: 'mouth 0.25s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
