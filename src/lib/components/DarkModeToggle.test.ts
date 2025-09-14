import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import DarkModeToggle from './DarkModeToggle.svelte';

describe('DarkModeToggle', () => {
	let mockLocalStorage: { [key: string]: string };

	beforeEach(() => {
		mockLocalStorage = {};
		document.documentElement.classList.remove('dark');

		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: (key: string) => mockLocalStorage[key] || null,
				setItem: (key: string, value: string) => {
					mockLocalStorage[key] = value;
				},
				removeItem: (key: string) => {
					delete mockLocalStorage[key];
				},
				clear: () => {
					mockLocalStorage = {};
				}
			},
			writable: true
		});
	});

	it('should render toggle button', () => {
		const { getByRole } = render(DarkModeToggle);
		const button = getByRole('button', { name: /toggle between light and dark mode/i });

		expect(button).toBeTruthy();
	});

	it('should initialize with current document state', () => {
		document.documentElement.classList.add('dark');

		const { getByRole } = render(DarkModeToggle);
		const button = getByRole('button');

		expect(button.getAttribute('aria-pressed')).toBe('true');
	});

	it('should toggle dark mode on click', async () => {
		const { getByRole } = render(DarkModeToggle);
		const button = getByRole('button', { name: /toggle between light and dark mode/i });

		expect(document.documentElement.classList.contains('dark')).toBe(false);
		expect(button.getAttribute('aria-pressed')).toBe('false');

		await fireEvent.click(button);

		expect(document.documentElement.classList.contains('dark')).toBe(true);
		expect(button.getAttribute('aria-pressed')).toBe('true');

		await fireEvent.click(button);

		expect(document.documentElement.classList.contains('dark')).toBe(false);
		expect(button.getAttribute('aria-pressed')).toBe('false');
	});

	it('should persist preference to localStorage', async () => {
		const { getByRole } = render(DarkModeToggle);
		const button = getByRole('button');

		await fireEvent.click(button);
		expect(mockLocalStorage['modeUserPrefers']).toBe('dark');

		await fireEvent.click(button);
		expect(mockLocalStorage['modeUserPrefers']).toBe('light');
	});

	it('should display correct icons for each mode', () => {
		const { container } = render(DarkModeToggle);

		const lightIcon = container.querySelector('.text-white');
		const darkIcon = container.querySelector('.text-black');

		expect(lightIcon?.textContent).toBe('光');
		expect(darkIcon?.textContent).toBe('闇');
	});

	it('should have proper accessibility attributes', () => {
		const { getByRole } = render(DarkModeToggle);
		const button = getByRole('button');

		expect(button.getAttribute('aria-label')).toBe('Toggle between light and dark mode');
		expect(button.getAttribute('type')).toBe('button');
	});
});
