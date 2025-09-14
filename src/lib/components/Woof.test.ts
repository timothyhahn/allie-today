import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import Woof from './Woof.svelte';

describe('Woof', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should render a random dog sound', () => {
		const { container } = render(Woof);
		const woofText = container.querySelector('.woof-text');

		expect(woofText).toBeTruthy();
		const text = woofText?.textContent;
		expect(['ruff', 'bork', 'boof', 'woof', 'bark']).toContain(text);
	});

	it('should display individual letters', () => {
		const { container } = render(Woof);
		const letters = container.querySelectorAll('.woof-letter');

		expect(letters.length).toBeGreaterThan(0);
		expect(letters.length).toBeLessThanOrEqual(4);
	});

	it('should trigger initial animation after 500ms', async () => {
		const { container } = render(Woof);

		const woofLetters = container.querySelectorAll('.woof-letter');
		woofLetters.forEach((letter) => {
			expect((letter as HTMLElement).classList.contains('woof-wave')).toBe(false);
		});

		vi.advanceTimersByTime(500);
		await waitFor(() => {
			const animatedLetters = container.querySelectorAll('.woof-letter.woof-wave');
			expect(animatedLetters.length).toBeGreaterThan(0);
		});
	});

	it('should cycle through words after delay', async () => {
		const { container } = render(Woof);
		const initialText = container.querySelector('.woof-text')?.textContent;
		// Advance to the scheduled change (10-30s random). Use the max 30s to be safe
		vi.advanceTimersByTime(30000);
		// Allow the internal 200ms/400ms nested timeouts to run
		vi.advanceTimersByTime(1000);

		await waitFor(() => {
			// After advancing timers, the displayed word should have changed
			expect(container.querySelector('.woof-text')?.textContent).not.toEqual(initialText);
		});
	});

	it('should have staggered animation delays on letters', () => {
		const { container } = render(Woof);
		const letters = container.querySelectorAll('.woof-letter');

		letters.forEach((letter, index) => {
			const style = (letter as HTMLElement).style;
			expect(style.animationDelay).toBe(`${index * 0.1}s`);
		});
	});

	it('should clean up timers on unmount', () => {
		const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
		const { unmount } = render(Woof);

		vi.advanceTimersByTime(500);

		unmount();

		expect(clearTimeoutSpy).toHaveBeenCalled();
	});
});
