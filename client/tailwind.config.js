/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#40513B',
      },
    },
  },
  plugins: [],
  important: true, // Thêm dòng này để Tailwind có thể override Ant Design styles khi cần
}