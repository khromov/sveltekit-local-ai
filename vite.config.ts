import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		{
			name: 'configure-response-headers',
			configureServer(server) {
				server.middlewares.use((req, res, next) => {
					res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
					res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
					next();
				});
			}
		},
		sveltekit()
	],
	optimizeDeps: {
		exclude: ['@transcribe/shout']
	},
	worker: {
		format: 'es'
	}
});
