<script lang="ts">
	import { onMount } from 'svelte';

	let isDarkMode = $state(false);

	function toggleDarkMode() {
		const htmlElement = document.documentElement;
		isDarkMode = !isDarkMode;

		if (isDarkMode) {
			htmlElement.classList.add('dark');
			localStorage.setItem('modeUserPrefers', 'dark');
		} else {
			htmlElement.classList.remove('dark');
			localStorage.setItem('modeUserPrefers', 'light');
		}
	}

	onMount(() => {
		isDarkMode = document.documentElement.classList.contains('dark');
	});
</script>

<button
	onclick={toggleDarkMode}
	class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 shadow-md transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-100 dark:focus:ring-blue-400"
	aria-label="Toggle between light and dark mode"
	aria-pressed={isDarkMode}
	type="button"
>
	<div class="relative flex h-4 w-4 items-center justify-center overflow-hidden" aria-hidden="true">
		<span
			class="text-md font-small absolute translate-y-0 text-white opacity-100 transition-transform duration-500 ease-out dark:translate-y-full dark:opacity-0"
			>光</span
		>
		<span
			class="text-md font-small absolute -translate-y-full text-black opacity-0 transition-transform duration-500 ease-out dark:translate-y-0 dark:opacity-100"
			>闇</span
		>
	</div>
</button>
