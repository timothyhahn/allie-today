import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createFocusTrap, focusTrap } from './focusTrap';

describe('focusTrap', () => {
	let container: HTMLElement;
	let button1: HTMLButtonElement;
	let button2: HTMLButtonElement;
	let link: HTMLAnchorElement;
	let input: HTMLInputElement;
	let disabledButton: HTMLButtonElement;

	beforeEach(() => {
		document.body.innerHTML = '';

		container = document.createElement('div');
		container.tabIndex = 0;

		button1 = document.createElement('button');
		button1.textContent = 'Button 1';

		button2 = document.createElement('button');
		button2.textContent = 'Button 2';

		link = document.createElement('a');
		link.href = '#';
		link.textContent = 'Link';

		input = document.createElement('input');
		input.type = 'text';

		disabledButton = document.createElement('button');
		disabledButton.disabled = true;
		disabledButton.textContent = 'Disabled';

		container.appendChild(button1);
		container.appendChild(link);
		container.appendChild(input);
		container.appendChild(button2);
		container.appendChild(disabledButton);

		document.body.appendChild(container);
	});

	describe('createFocusTrap', () => {
		it('should focus first focusable element on activate', () => {
			const trap = createFocusTrap(container);
			trap.activate();

			expect(document.activeElement).toBe(button1);
		});

		it('should restore previous focus on deactivate', () => {
			const outsideButton = document.createElement('button');
			document.body.appendChild(outsideButton);
			outsideButton.focus();

			const trap = createFocusTrap(container);
			trap.activate();
			expect(document.activeElement).not.toBe(outsideButton);

			trap.deactivate();
			expect(document.activeElement).toBe(outsideButton);
		});

		it('should trap Tab key at last element', () => {
			const trap = createFocusTrap(container);
			trap.activate();

			button2.focus();

			const event = new KeyboardEvent('keydown', {
				key: 'Tab',
				bubbles: true
			});
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

			container.dispatchEvent(event);

			expect(preventDefaultSpy).toHaveBeenCalled();
			expect(document.activeElement).toBe(button1);
		});

		it('should trap Shift+Tab at first element', () => {
			const trap = createFocusTrap(container);
			trap.activate();

			button1.focus();

			const event = new KeyboardEvent('keydown', {
				key: 'Tab',
				shiftKey: true,
				bubbles: true
			});
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

			container.dispatchEvent(event);

			expect(preventDefaultSpy).toHaveBeenCalled();
			expect(document.activeElement).toBe(button2);
		});

		it('should ignore disabled elements', () => {
			const trap = createFocusTrap(container);
			trap.activate();

			const focusables = Array.from(
				container.querySelectorAll('button:not([disabled]), [href], input:not([disabled])')
			);
			expect(focusables).not.toContain(disabledButton);
			expect(focusables).toHaveLength(4);
		});

		it('should focus container if no focusable elements exist', () => {
			const emptyContainer = document.createElement('div');
			emptyContainer.tabIndex = 0;
			document.body.appendChild(emptyContainer);

			const trap = createFocusTrap(emptyContainer);
			trap.activate();

			expect(document.activeElement).toBe(emptyContainer);
		});

		it('should ignore non-Tab keys', () => {
			const trap = createFocusTrap(container);
			trap.activate();

			button1.focus();

			const event = new KeyboardEvent('keydown', {
				key: 'Enter',
				bubbles: true
			});
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

			container.dispatchEvent(event);

			expect(preventDefaultSpy).not.toHaveBeenCalled();
			expect(document.activeElement).toBe(button1);
		});
	});

	describe('focusTrap directive', () => {
		it('should activate trap on mount and deactivate on destroy', () => {
			const outsideButton = document.createElement('button');
			document.body.appendChild(outsideButton);
			outsideButton.focus();

			const { destroy } = focusTrap(container);
			expect(document.activeElement).toBe(button1);

			destroy();
			expect(document.activeElement).toBe(outsideButton);
		});
	});
});
