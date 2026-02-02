/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./screens/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                background: '#0B0E14',
                surface: '#151B26',
                primary: '#3B82F6',
                secondary: '#64748b',
                accent: '#10b981',
                success: '#22C55E',
                danger: '#EF4444',
            },
            animation: {
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
