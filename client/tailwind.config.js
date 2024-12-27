/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
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