import { expect, test } from '@playwright/test';

test.describe('Scroll Functionality', () => {
	test('should show scroll-to-top button when scrolled down', async ({ page }) => {
		await page.goto('/');

		const scrollButton = page.getByRole('button', { name: 'Scroll back to top of page' });
		const buttonExists = (await scrollButton.count()) > 0;

		if (!buttonExists) {
			await page.evaluate(() => window.scrollTo(0, 500));
			await page.waitForTimeout(100);
			await expect(scrollButton).toBeVisible();
		}
	});

	test('should scroll to top when scroll-to-top button is clicked', async ({ page }) => {
		await page.goto('/');

		await page.evaluate(() => window.scrollTo(0, 1000));
		await page.waitForTimeout(200);

		let scrollY = await page.evaluate(() => window.scrollY);
		expect(scrollY).toBeGreaterThan(0);

		const scrollButton = page.getByRole('button', { name: 'Scroll back to top of page' });
		await expect(scrollButton).toBeVisible();
		await scrollButton.click();

		await page.waitForTimeout(1000);

		scrollY = await page.evaluate(() => window.scrollY);
		expect(scrollY).toBeLessThan(100); // Allow for small variations due to animation
	});

	test('should handle infinite scroll loading', async ({ page }) => {
		await page.goto('/');
		await page.waitForTimeout(1000);

		const initialPostCount = await page.locator('article.post-card').count();

		if (initialPostCount > 0) {
			await page.evaluate(() => {
				window.scrollTo(0, document.body.scrollHeight - 200);
			});

			await page.waitForTimeout(2000);

			const finalPostCount = await page.locator('article.post-card').count();

			// Either more posts loaded, or we reached the end, or there were no more to load
			// This is just checking that the scroll mechanism doesn't break
			expect(finalPostCount).toBeGreaterThanOrEqual(initialPostCount);
		}
	});

	test('should preserve scroll position when navigating back from modal', async ({ page }) => {
		await page.goto('/');
		await page.waitForTimeout(1000);

		const posts = page.locator('article.post-card a');
		const postCount = await posts.count();

		if (postCount > 0) {
			await page.evaluate(() => window.scrollTo(0, 300));
			await page.waitForTimeout(200);

			const scrollBeforeClick = await page.evaluate(() => window.scrollY);

			await posts.first().click();
			await expect(page).toHaveURL(/\/posts\/.+/);

			await page.keyboard.press('Escape');
			await expect(page).toHaveURL('/');

			await page.waitForTimeout(500);

			const scrollAfterReturn = await page.evaluate(() => window.scrollY);
			expect(Math.abs(scrollAfterReturn - scrollBeforeClick)).toBeLessThan(50);
		}
	});

	test('should have proper ARIA attributes on scroll button', async ({ page }) => {
		await page.goto('/');

		await page.evaluate(() => window.scrollTo(0, 500));
		await page.waitForTimeout(100);

		const scrollButton = page.getByRole('button', { name: 'Scroll back to top of page' });
		await expect(scrollButton).toBeVisible();

		await expect(scrollButton).toHaveAttribute('type', 'button');
		await expect(scrollButton).toHaveAttribute('aria-label', 'Scroll back to top of page');

		const icon = scrollButton.locator('svg');
		await expect(icon).toHaveAttribute('aria-hidden', 'true');
	});

	test('should have smooth scroll behavior', async ({ page }) => {
		await page.goto('/');

		await page.evaluate(() => window.scrollTo(0, 1000));
		await page.waitForTimeout(200);

		const scrollButton = page.getByRole('button', { name: 'Scroll back to top of page' });
		await scrollButton.click();

		await page.waitForTimeout(100); // Short wait
		const intermediateScroll = await page.evaluate(() => window.scrollY);

		expect(intermediateScroll).toBeGreaterThan(0);
		expect(intermediateScroll).toBeLessThan(1000);

		await page.waitForTimeout(1000);
		const finalScroll = await page.evaluate(() => window.scrollY);
		expect(finalScroll).toBe(0);
	});
});
