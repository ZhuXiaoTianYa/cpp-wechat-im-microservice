/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wechat-primary': '#07C160',
        'wechat-bg-gray': '#EDEDED',
        'wechat-bubble-self': '#95EC69',
        'wechat-bubble-other': '#FFFFFF',
        'wechat-border': '#D9D9D9',
        'wechat-text-primary': '#191919',
        'wechat-text-secondary': '#ABABAB',
        'wechat-hover': '#E0DEDE',
        'wechat-active': '#C9C7C7',
      },
    },
  },
  plugins: [],
}
