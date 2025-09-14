import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ScrollToTopButton from './ScrollToTopButton.svelte';

describe('ScrollToTopButton', () => {
	it('should not render when show is false', () => {
		const { container } = render(ScrollToTopButton, {
			props: {
				show: false,
				scrollToTop: vi.fn()
			}
		});

		const button = container.querySelector('button');
		expect(button).toBeNull();
	});

	it('should render when show is true', () => {
		const { getByRole } = render(ScrollToTopButton, {
			props: {
				show: true,
				scrollToTop: vi.fn()
			}
		});

		const button = getByRole('button', { name: /Scroll back to top of page/i });
		expect(button).toBeTruthy();
	});

	it('should call scrollToTop when clicked', async () => {
		const scrollToTopMock = vi.fn();
		const { getByRole } = render(ScrollToTopButton, {
			props: {
				show: true,
				scrollToTop: scrollToTopMock
			}
		});

		const button = getByRole('button');
		await fireEvent.click(button);

		expect(scrollToTopMock).toHaveBeenCalledTimes(1);
	});

	it('should have proper accessibility attributes', () => {
		const { getByRole } = render(ScrollToTopButton, {
			props: {
				show: true,
				scrollToTop: vi.fn()
			}
		});

		const button = getByRole('button');
		expect(button.getAttribute('aria-label')).toBe('Scroll back to top of page');
	});

	it('should contain an up arrow icon', () => {
		const { container } = render(ScrollToTopButton, {
			props: {
				show: true,
				scrollToTop: vi.fn()
			}
		});

		const svg = container.querySelector('svg');
		expect(svg).toBeTruthy();
		expect(svg?.getAttribute('stroke')).toBe('currentColor');
	});

	it('should have transition classes', () => {
		const { getByRole } = render(ScrollToTopButton, {
			props: {
				show: true,
				scrollToTop: vi.fn()
			}
		});

		const button = getByRole('button');
		expect(button.className).toContain('transition-all');
		expect(button.className).toContain('hover:scale-110');
	});
});
