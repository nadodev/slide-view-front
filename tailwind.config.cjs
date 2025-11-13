module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          1: '#667eea',
          2: '#764ba2',
        },
        text: '#2d3748',
        presenter: {
          bg: '#0b1220',
          surface: '#0f172a',
          surface2: '#111827',
          text: '#e5e7eb',
        },
      },
      borderRadius: {
        'xl-2': '12px',
      },
    },
  },
  plugins: [],
};
