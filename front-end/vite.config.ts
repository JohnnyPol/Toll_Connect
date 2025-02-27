import deno from '@deno/vite-plugin';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [deno(), react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src/'),
		},
	},
});
