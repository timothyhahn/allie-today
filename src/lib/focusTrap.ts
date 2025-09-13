export function createFocusTrap(element: HTMLElement) {
	const focusableElements = [
		'button:not([disabled])',
		'[href]',
		'input:not([disabled])',
		'select:not([disabled])',
		'textarea:not([disabled])',
		'[tabindex]:not([tabindex="-1"])'
	];

	const focusableQuery = focusableElements.join(', ');
	let previouslyFocused: HTMLElement | null = null;

	function getFocusableElements(): HTMLElement[] {
		return Array.from(element.querySelectorAll(focusableQuery)) as HTMLElement[];
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		const focusables = getFocusableElements();
		if (focusables.length === 0) return;

		const firstFocusable = focusables[0];
		const lastFocusable = focusables[focusables.length - 1];

		if (event.shiftKey) {
			// Shift + Tab
			if (document.activeElement === firstFocusable) {
				event.preventDefault();
				lastFocusable.focus();
			}
		} else {
			// Tab
			if (document.activeElement === lastFocusable) {
				event.preventDefault();
				firstFocusable.focus();
			}
		}
	}

	function activate() {
		previouslyFocused = document.activeElement as HTMLElement;

		// Focus the first focusable element or the container itself
		const focusables = getFocusableElements();
		if (focusables.length > 0) {
			focusables[0].focus();
		} else {
			element.focus();
		}

		element.addEventListener('keydown', handleKeyDown);
	}

	function deactivate() {
		element.removeEventListener('keydown', handleKeyDown);

		// Restore focus to the previously focused element
		if (previouslyFocused) {
			previouslyFocused.focus();
		}
	}

	return {
		activate,
		deactivate
	};
}

export function focusTrap(element: HTMLElement) {
	const trap = createFocusTrap(element);
	trap.activate();

	return {
		destroy() {
			trap.deactivate();
		}
	};
}
