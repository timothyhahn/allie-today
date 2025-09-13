<script lang="ts">
	let {
		isDarkMode,
		woofAnimating,
		toggleDarkMode
	}: {
		isDarkMode: boolean;
		woofAnimating: boolean;
		toggleDarkMode: () => void;
	} = $props();
</script>

<header class="mb-4 flex items-center justify-between">
	<div></div>
	<h1 class="h1 flex-1 text-center">
		Allie says, "<span class="woof-text" aria-label="woof"
			>{#each ['w', 'o', 'o', 'f'] as letter, i}<span
					class="woof-letter {woofAnimating ? 'woof-wave' : ''}"
					style="animation-delay: {i * 0.1}s"
					aria-hidden="true">{letter}</span
				>{/each}</span
		>"
	</h1>
	<button
		onclick={toggleDarkMode}
		class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 shadow-md transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-100 dark:focus:ring-blue-400"
		aria-label="Toggle between light and dark mode"
		aria-pressed={isDarkMode}
		type="button"
	>
		<div
			class="relative flex h-4 w-4 items-center justify-center overflow-hidden"
			aria-hidden="true"
		>
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
</header>

<style>
	.woof-text {
		display: inline-block;
	}

	.woof-letter {
		display: inline-block;
		transition: transform 0.1s ease;
	}

	.woof-wave {
		animation: wave 0.8s ease-in-out;
	}

	@keyframes wave {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		25% {
			transform: translateY(-6px) rotate(-5deg);
		}
		50% {
			transform: translateY(0px) rotate(0deg);
		}
		75% {
			transform: translateY(-3px) rotate(3deg);
		}
	}
</style>
