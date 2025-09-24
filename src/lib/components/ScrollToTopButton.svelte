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
		class="focus:ring-primary dark:bg-surface-800/80 fixed right-4 bottom-4 z-50 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
		aria-label="Scroll back to top of page"
		type="button"
	>
		<ArrowUp size={16} class="text-surface-600 dark:text-surface-300" aria-hidden="true" />
	</button>
{/if}
