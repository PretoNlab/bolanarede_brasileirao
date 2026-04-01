/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./screens/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./engine/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Design System Tokens
                background:  '#030A06',
                primary:     '#1FB185',
                secondary:   '#0D4A35',
                tertiary:    '#E05A5A',
                'primary-light': '#4ECDA4',

                // Surface tokens
                surface:         '#0A1A12',
                'surface-low':   '#0D2118',
                'surface-high':  '#142B1F',
                'surface-highest': '#1A3828',

                // Text tokens
                'on-surface':         '#EDFAF4',
                'on-surface-variant': '#7AAD94',
            },
            animation: {
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
