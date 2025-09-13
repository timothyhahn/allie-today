import { expect, test } from '@playwright/test';

test.describe('Post Detail Modal', () => {
	test('should open modal when clicking on a post', async ({ page }) => {
		await page.goto('/');
		await page.waitForTimeout(1000);

		const posts = page.locator('article.post-card a');
		const postCount = await posts.count();

		if (postCount > 0) {
			await posts.first().click();
			await expect(page).toHaveURL(/\/posts\/.+/);

			const modal = page.getByRole('dialog');
			await expect(modal).toBeVisible();

			const closeButton = page.getByRole('button', { name: 'Close image view' });
			await expect(closeButton).toBeVisible();
		}
	});

	test('should close modal with close button', async ({ page }) => {
		await page.goto('/');

		const posts = page.locator('article.post-card a');
		const postCount = await posts.count();

		if (postCount > 0) {
			await posts.first().click();
			await expect(page).toHaveURL(/\/posts\/.+/);

			const closeButton = page.getByRole('button', { name: 'Close image view' });
			await closeButton.click();

			await expect(page).toHaveURL('/');
		}
	});

	test('should close modal with Escape key', async ({ page }) => {
		await page.goto('/');

		const posts = page.locator('article.post-card a');
		const postCount = await posts.count();

		if (postCount > 0) {
			await posts.first().click();
			await expect(page).toHaveURL(/\/posts\/.+/);

			await page.keyboard.press('Escape');
			await expect(page).toHaveURL('/');
		}
	});

	test('should display image in modal', async ({ page }) => {
		await page.goto('/');

		const posts = page.locator('article.post-card a');
		const postCount = await posts.count();

		if (postCount > 0) {
			await posts.first().click();
			await expect(page).toHaveURL(/\/posts\/.+/);

			const modalImage = page.getByRole('dialog').locator('img').last(); // Get the large image, not the loading spinner
			await expect(modalImage).toBeVisible();
			await expect(modalImage).toHaveAttribute('alt');
		}
	});

	test('should prevent background scrolling when modal is open', async ({ page }) => {
		await page.goto('/');

		const posts = page.locator('article.post-card a');
		const postCount = await posts.count();

		if (postCount > 0) {
			await posts.first().click();
			await expect(page).toHaveURL(/\/posts\/.+/);

			const bodyOverflow = await page.evaluate(() => {
				return window.getComputedStyle(document.body).overflow;
			});
			expect(bodyOverflow).toBe('hidden');
		}
	});

	test('should have proper ARIA attributes', async ({ page }) => {
		await page.goto('/');

		const posts = page.locator('article.post-card a');
		const postCount = await posts.count();

		if (postCount > 0) {
			await posts.first().click();
			await expect(page).toHaveURL(/\/posts\/.+/);

			const modal = page.getByRole('dialog');
			await expect(modal).toHaveAttribute('aria-modal', 'true');
			await expect(modal).toHaveAttribute('aria-labelledby');
			await expect(modal).toHaveAttribute('aria-describedby');
		}
	});
});
