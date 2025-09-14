import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['./vitest.setup.ts'],
		alias: {
			$lib: path.resolve('./src/lib'),
			$app: path.resolve('./src/app')
		}
	},
	resolve: {
		conditions: ['browser']
	}
});
