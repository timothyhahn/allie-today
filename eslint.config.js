import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		ignores: ['.svelte-kit/**', 'build/**', 'dist/**']
	},
	{
		files: ['**/*.{js,ts,mjs}'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2020
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2017
			}
		},
		plugins: {
			'@typescript-eslint': typescript
		},
		rules: {
			...typescript.configs.recommended.rules,
			'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: typescriptParser,
				extraFileExtensions: ['.svelte']
			},
			globals: {
				...globals.browser
			}
		},
		plugins: {
			svelte
		},
		rules: {
			...svelte.configs.recommended.rules,
			'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
		}
	},
	{
		files: ['tests/**/*.{js,ts}', '**/*.test.{js,ts}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	prettier
];
