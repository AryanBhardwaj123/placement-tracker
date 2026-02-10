/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#050505',
                    card: '#0A0A0A',
                    border: '#262626',
                    text: '#EDEDED',
                    muted: '#A1A1AA',
                    hover: '#18181B'
                },
                brand: {
                    DEFAULT: '#6366f1', // Indigo 500
                    hover: '#4f46e5', // Indigo 600
                    light: '#818cf8', // Indigo 400
                    glow: 'rgba(99, 102, 241, 0.5)'
                },
                accent: {
                    purple: '#8b5cf6',
                    cyan: '#06b6d4',
                    rose: '#f43f5e',
                    emerald: '#10b981',
                    amber: '#f59e0b'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translatedY(20px)', opacity: '0' },
                    '100%': { transform: 'translatedY(0)', opacity: '1' },
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
            }
        },
    },
    plugins: [],
}
