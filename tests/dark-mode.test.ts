import { expect, test } from '@playwright/test';

test.describe('Dark Mode Toggle', () => {
	test('should toggle dark mode when clicking the toggle button', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.getByRole('button', { name: 'Toggle between light and dark mode' });
		await expect(toggleButton).toBeVisible();

		let htmlClasses = (await page.locator('html').getAttribute('class')) || '';
		const initiallyDark = htmlClasses.includes('dark');

		await toggleButton.click();

		htmlClasses = (await page.locator('html').getAttribute('class')) || '';
		const nowDark = htmlClasses.includes('dark');
		expect(nowDark).toBe(!initiallyDark);

		await toggleButton.click();

		htmlClasses = (await page.locator('html').getAttribute('class')) || '';
		const finalDark = htmlClasses.includes('dark');
		expect(finalDark).toBe(initiallyDark);
	});

	test('should persist dark mode preference in localStorage', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.getByRole('button', { name: 'Toggle between light and dark mode' });
		await toggleButton.click();

		const savedPreference = await page.evaluate(() => {
			return localStorage.getItem('modeUserPrefers');
		});

		expect(['dark', 'light']).toContain(savedPreference);
	});

	test('should show correct icon for current mode', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.getByRole('button', { name: 'Toggle between light and dark mode' });

		const buttonContent = await toggleButton.textContent();
		expect(buttonContent).toMatch(/[光闇]/);

		await toggleButton.click();
		const allContent = await toggleButton.locator('span').allTextContents();
		expect(allContent.join('')).toMatch(/光.*闇|闇.*光/);
	});

	test('should have proper ARIA attributes', async ({ page }) => {
		await page.goto('/');

		const toggleButton = page.getByRole('button', { name: 'Toggle between light and dark mode' });

		await expect(toggleButton).toHaveAttribute('type', 'button');
		await expect(toggleButton).toHaveAttribute('aria-pressed');

		const initialPressed = await toggleButton.getAttribute('aria-pressed');
		await toggleButton.click();
		const newPressed = await toggleButton.getAttribute('aria-pressed');

		expect(initialPressed).not.toBe(newPressed);
	});

	test('should be keyboard accessible', async ({ page }) => {
		await page.goto('/');

		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab'); // May need multiple tabs depending on skip link

		for (let i = 0; i < 10; i++) {
			const currentFocus = await page.evaluate(() =>
				document.activeElement?.getAttribute('aria-label')
			);
			if (currentFocus === 'Toggle between light and dark mode') {
				break;
			}
			await page.keyboard.press('Tab');
		}

		const htmlClasses = (await page.locator('html').getAttribute('class')) || '';
		const initiallyDark = htmlClasses.includes('dark');

		await page.keyboard.press('Enter');

		const newHtmlClasses = (await page.locator('html').getAttribute('class')) || '';
		const nowDark = newHtmlClasses.includes('dark');
		expect(nowDark).toBe(!initiallyDark);
	});
});
