/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				space: ['Space Grotesk', 'system-ui', 'sans-serif'],
				bebas: ['Bebas Neue', 'sans-serif']
			},
			colors: {
				'neo-yellow': '#ffd93d',
				'neo-yellow-light': '#ffd700',
				'neo-green': '#98fb98',
				'neo-green-light': '#90ee90',
				'neo-pink': '#ff69b4',
				'neo-peach': '#ffe5b4',
				'neo-lavender': '#e6e6fa',
				'neo-mint': '#b4e7ce',
				'neo-coral': '#ffb6c1',
				'neo-red': '#ff6b6b',
				'neo-orange': '#ffa500'
			},
			animation: {
				'gradient-shift': 'gradient-shift 20s ease infinite',
				float: 'float 3s ease-in-out infinite',
				'float-1': 'float1 8s ease-in-out infinite',
				'float-2': 'float2 10s ease-in-out infinite',
				'bounce-dot': 'bounce-dot 1.4s infinite ease-in-out both',
				'pulse-emoji': 'pulse-emoji 1.5s ease-in-out infinite',
				'wobble-in': 'wobbleIn 0.5s ease-out',
				'slide-in': 'slideIn 0.3s ease-out',
				'slide-in-chat': 'slideInChat 0.5s ease-out',
				'message-slide': 'messageSlide 0.4s ease-out',
				'bounce-in': 'bounceIn 0.6s ease-out',
				sparkle: 'sparkle 3s ease-in-out infinite',
				shimmer: 'shimmer 1.5s infinite',
				'spin-slow': 'spin 15s linear infinite',
				'spin-fast': 'spin 1s linear infinite',
				shake: 'shake 0.5s ease-in-out infinite',
				flash: 'flash 1s ease-in-out infinite',
				'result-slide': 'resultSlide 0.5s ease-out',
				'copy-success': 'copySuccess 0.3s ease-out',
				'card-fade': 'cardFade 0.6s ease-out',
				slide: 'slide 2s linear infinite',
				'float-deco': 'float-deco 4s ease-in-out infinite'
			},
			keyframes: {
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0) rotate(-5deg)' },
					'50%': { transform: 'translateY(-15px) rotate(5deg)' }
				},
				float1: {
					'0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
					'50%': { transform: 'translate(-10px, 10px) rotate(180deg)' }
				},
				float2: {
					'0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
					'50%': { transform: 'translate(10px, -10px) rotate(-180deg)' }
				},
				'bounce-dot': {
					'0%, 80%, 100%': { transform: 'scale(0.8) translateY(0)', opacity: '0.5' },
					'40%': { transform: 'scale(1.2) translateY(-8px)', opacity: '1' }
				},
				'pulse-emoji': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.2)' }
				},
				wobbleIn: {
					from: { transform: 'scale(0.9) rotate(-3deg)', opacity: '0' },
					to: { transform: 'scale(1) rotate(-1deg)', opacity: '1' }
				},
				slideIn: {
					from: { transform: 'translateY(10px) rotate(0.5deg)', opacity: '0' },
					to: { transform: 'translateY(0) rotate(0.5deg)', opacity: '1' }
				},
				slideInChat: {
					from: { opacity: '0', transform: 'translateY(20px) rotate(0deg)' },
					to: { opacity: '1', transform: 'translateY(0) rotate(0deg)' }
				},
				messageSlide: {
					from: { opacity: '0', transform: 'translateY(15px) scale(0.95)' },
					to: { opacity: '1', transform: 'translateY(0) scale(1)' }
				},
				bounceIn: {
					'0%': { opacity: '0', transform: 'scale(0.9) rotate(-1deg)' },
					'50%': { transform: 'scale(1.05) rotate(1deg)' },
					'100%': { opacity: '1', transform: 'scale(1) rotate(0.5deg)' }
				},
				sparkle: {
					'0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
					'50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' }
				},
				shimmer: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				shake: {
					'0%, 100%': { transform: 'translateX(0) rotate(-1deg)' },
					'25%': { transform: 'translateX(-2px) rotate(-1deg)' },
					'75%': { transform: 'translateX(2px) rotate(-1deg)' }
				},
				flash: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				resultSlide: {
					from: { transform: 'translateY(20px) rotate(-1deg)', opacity: '0' },
					to: { transform: 'translateY(0) rotate(0.5deg)', opacity: '1' }
				},
				copySuccess: {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' },
					'100%': { transform: 'scale(1)' }
				},
				cardFade: {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				slide: {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(16px)' }
				},
				'float-deco': {
					'0%, 100%': { transform: 'translateY(-50%) rotate(45deg) scale(1)' },
					'50%': { transform: 'translateY(-50%) rotate(45deg) scale(1.1)' }
				}
			},
			boxShadow: {
				'neo-sm': '2px 2px 0 #000',
				neo: '3px 3px 0 #000',
				'neo-md': '4px 4px 0 #000',
				'neo-lg': '5px 5px 0 #000',
				'neo-xl': '6px 6px 0 #000',
				'neo-2xl': '7px 7px 0 #000',
				'neo-3xl': '8px 8px 0 #000',
				'neo-4xl': '10px 10px 0 #000',
				'neo-5xl': '12px 12px 0 #000',
				'neo-inset': 'inset 3px 3px 0 rgba(0, 0, 0, 0.1)'
			},
			backgroundImage: {
				'gradient-warm': 'linear-gradient(135deg, #ffe5b4 0%, #e6e6fa 50%, #b4e7ce 100%)',
				'gradient-yellow': 'linear-gradient(135deg, #ffd93d 0%, #ffa500 100%)',
				'gradient-green': 'linear-gradient(135deg, #ffd93d 0%, #98fb98 100%)',
				'gradient-pink': 'linear-gradient(135deg, #ffd93d 0%, #ff69b4 100%)',
				'gradient-light': 'linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)',
				'gradient-subtle':
					'linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(152, 251, 152, 0.1) 100%)',
				'gradient-subtle-2':
					'linear-gradient(135deg, rgba(255, 229, 180, 0.1) 0%, rgba(230, 230, 250, 0.1) 100%)',
				'gradient-subtle-3':
					'linear-gradient(135deg, rgba(255, 217, 61, 0.05) 0%, rgba(152, 251, 152, 0.05) 100%)',
				'gradient-red': 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
				'gradient-gray': 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)',
				'gradient-gold': 'linear-gradient(90deg, #ffd700 0%, #ffa500 100%)',
				'repeating-stripes':
					'repeating-linear-gradient(90deg, #ffd93d, #ffd93d 10px, #98fb98 10px, #98fb98 20px, #ff69b4 20px, #ff69b4 30px)',
				'repeating-stripes-2':
					'repeating-linear-gradient(90deg, #98fb98, #98fb98 8px, #ffd93d 8px, #ffd93d 16px)',
				'repeating-stripes-3':
					'repeating-linear-gradient(90deg, #000, #000 8px, #98fb98 8px, #98fb98 16px)',
				'repeating-stripes-4':
					'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0, 0, 0, 0.02) 40px, rgba(0, 0, 0, 0.02) 41px)',
				'repeating-diagonal':
					'repeating-linear-gradient(45deg, #98fb98, #98fb98 10px, transparent 10px, transparent 20px)'
			}
		}
	},
	plugins: []
};
