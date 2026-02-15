import type { Config } from 'tailwindcss';

export default {
	darkMode: ['class'],
	content: [
		'./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
		'./storage/framework/views/*.php',
		'./resources/views/**/*.blade.php',
		'./resources/js/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				// Palette Afro-centrée ARTDOM
				background: {
					DEFAULT: '#1A0F0A', // Brun foncé chaud (terre africaine)
					secondary: '#2C1810', // Brun chocolat
				},
				foreground: '#FFFBF0', // Blanc cassé chaud

				// Couleurs principales
				primary: {
					DEFAULT: '#FDB913', // Jaune or - richesse et soleil africain
					foreground: '#1A0F0A',
					50: '#FFF9E6',
					100: '#FFF3CC',
					200: '#FFE799',
					300: '#FEDB66',
					400: '#FECF33',
					500: '#FDB913', // Base
					600: '#E4A50F',
					700: '#B8840C',
					800: '#8C6309',
					900: '#604206',
				},
				secondary: {
					DEFAULT: '#E63946', // Rouge vif - énergie, passion
					foreground: '#FFFBF0',
					50: '#FCE8EA',
					100: '#F9D1D5',
					200: '#F3A3AB',
					300: '#ED7581',
					400: '#E74757',
					500: '#E63946', // Base
					600: '#D12534',
					700: '#A51D29',
					800: '#79151E',
					900: '#4D0E13',
				},
				accent: {
					DEFAULT: '#06A77D', // Vert émeraude - vie, nature
					foreground: '#FFFBF0',
					50: '#E6F7F3',
					100: '#CCEFE7',
					200: '#99DFCF',
					300: '#66CFB7',
					400: '#33BF9F',
					500: '#06A77D', // Base
					600: '#059670',
					700: '#04785A',
					800: '#035A44',
					900: '#023C2E',
				},

				// Couleurs de support
				orange: {
					DEFAULT: '#FF6B35', // Chaleur, coucher de soleil
					foreground: '#FFFBF0',
					50: '#FFEEE7',
					100: '#FFDCCF',
					200: '#FFB99F',
					300: '#FF966F',
					400: '#FF733F',
					500: '#FF6B35', // Base
					600: '#E65020',
					700: '#B33F19',
					800: '#802E12',
					900: '#4D1C0B',
				},
				gold: {
					DEFAULT: '#D4AF37', // Or métallique - accents premium
					foreground: '#1A0F0A',
					50: '#FAF6E8',
					100: '#F5EDD1',
					200: '#EBDBA3',
					300: '#E1C975',
					400: '#D7B747',
					500: '#D4AF37', // Base
					600: '#BF9E2C',
					700: '#967C22',
					800: '#6D5A19',
					900: '#44380F',
				},

				// Couleurs UI (Shadcn compatibility)
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Montserrat', 'sans-serif'],
			},
			backgroundImage: {
				'gradient-sunset': 'linear-gradient(135deg, #FDB913 0%, #FF6B35 50%, #E63946 100%)', // Jaune → Orange → Rouge
				'gradient-earth': 'linear-gradient(180deg, #2C1810 0%, #1A0F0A 100%)', // Brun chocolat → Brun foncé
				'gradient-emerald': 'linear-gradient(135deg, #06A77D 0%, #04785A 100%)', // Vert émeraude
				'pattern-kente': "url('/images/patterns/kente.svg')",
				'pattern-mudcloth': "url('/images/patterns/mudcloth.svg')",
				'pattern-adinkra': "url('/images/patterns/adinkra.svg')",
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-down': {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'dance-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				shimmer: {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' },
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-in-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				'dance-bounce': 'dance-bounce 1s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config;
