<script lang="ts">
	import { ArrowUp } from 'lucide-svelte';

	let {
		show,
		scrollToTop
	}: {
		show: boolean;
		scrollToTop: () => void;
	} = $props();
</script>

{#if show}
	<button
		onclick={scrollToTop}
		class="fixed right-4 bottom-4 z-50 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800/80 dark:focus:ring-blue-400"
		aria-label="Scroll back to top of page"
		type="button"
	>
		<ArrowUp size={16} class="text-gray-600 dark:text-gray-300" aria-hidden="true" />
	</button>
{/if}
