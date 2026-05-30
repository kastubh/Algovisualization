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
        chalk: '#E8E8D8',
        board: '#1B4332',
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
        'teacher-bob': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-3px) rotate(-0.5deg)' },
        },
        'point-arm': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        blink: {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(0.25)' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.65' },
          '50%': { transform: 'scale(1.18)', opacity: '1' },
        },
        'write-pen': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(-4deg)' },
          '35%': { transform: 'translate(-120px, -34px) rotate(-10deg)' },
          '70%': { transform: 'translate(-42px, -72px) rotate(3deg)' },
        },
        caret: {
          '0%, 45%': { opacity: '1' },
          '46%, 100%': { opacity: '0' },
        },
      },
      animation: {
        bob: 'bob 1.8s ease-in-out infinite',
        mouth: 'mouth 0.25s ease-in-out infinite',
        'teacher-bob': 'teacher-bob 2s ease-in-out infinite',
        'point-arm': 'point-arm 0.9s ease-in-out infinite',
        blink: 'blink 3.5s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.2s ease-in-out infinite',
        'write-pen': 'write-pen 3s ease-in-out infinite',
        caret: 'caret 0.8s step-end infinite',
      },
    },
  },
  plugins: [],
};
