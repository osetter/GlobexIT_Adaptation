import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

export default ({ mode }: { mode: string }) => {
	const isProduction = mode === 'production';

	return defineConfig({
		plugins: [react()],
		resolve: {
			alias: {
				'@api': path.resolve(__dirname, './src/api'),
				'@pages': path.resolve(__dirname, './src/pages'),
				'@app': path.resolve(__dirname, './src/app'),
			},
		},
		base: isProduction
			? '/adaptation-structure/web-templates/frontend/assesment-procedure/dist'
			: '/',
		server: {
			open: true,
			port: 5174,
			proxy: {
				'/custom_web_template': {
					target: 'http://localhost:80',
					changeOrigin: true,
				},
			},
		},
		build: {
			sourcemap: false,
			outDir: 'dist',
			assetsDir: 'assets',
			emptyOutDir: true,
		},
	});
};
