import { expect, test } from '@playwright/test';

test.describe('Main Page', () => {
	test('should display the header with Allie says woof', async ({ page }) => {
		await page.goto('/');

		const heading = page.locator('h1');
		await expect(heading).toBeVisible();
		await expect(heading).toContainText('Allie says');
		await expect(page.locator('.woof-letter')).toHaveCount(4);
	});

	test('should display photo gallery', async ({ page }) => {
		await page.goto('/');

		const gallery = page.getByRole('main').locator('section[aria-label="Photo gallery"]');
		await expect(gallery).toBeVisible();
		await expect(gallery).toHaveClass(/grid/);
	});

	test('should display posts if data is available', async ({ page }) => {
		await page.goto('/');
		await page.waitForTimeout(1000);

		const posts = page.locator('article.post-card');
		const postCount = await posts.count();

		if (postCount > 0) {
			const firstPost = posts.first();
			await expect(firstPost.locator('img')).toBeVisible();
			await expect(firstPost.locator('a')).toHaveAttribute('aria-label');
		}
	});

	test('should have skip to main content link', async ({ page }) => {
		await page.goto('/');

		const skipLink = page.getByRole('link', { name: 'Skip to main content' });
		await expect(skipLink).toBeAttached();
		await expect(skipLink).toHaveAttribute('href', '#main-content');
	});

	test('should handle keyboard navigation', async ({ page }) => {
		await page.goto('/');

		await page.keyboard.press('End');
		await page.waitForTimeout(300);
		await page.keyboard.press('Home');
		await page.waitForTimeout(1000); // Wait for smooth scroll animation

		const scrollY = await page.evaluate(() => window.scrollY);
		expect(scrollY).toBeLessThan(100);
	});
});
