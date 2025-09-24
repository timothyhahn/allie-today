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
	class="focus:ring-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black shadow-md transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none dark:bg-white"
	aria-label="Toggle between light and dark mode"
	aria-pressed={isDarkMode}
	type="button"
>
	<div class="relative flex h-4 w-4 items-center justify-center overflow-hidden" aria-hidden="true">
		<span
			class="absolute translate-y-0 text-sm font-normal text-white opacity-100 transition-transform duration-500 ease-out dark:translate-y-full dark:opacity-0"
			>光</span
		>
		<span
			class="absolute -translate-y-full text-sm font-normal text-black opacity-0 transition-transform duration-500 ease-out dark:translate-y-0 dark:opacity-100"
			>闇</span
		>
	</div>
</button>
