<script>
	import '../app.css';
	import { autoModeWatcher } from '@skeletonlabs/skeleton';
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>

<a
	href="#main-content"
	class="sr-only z-50 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
>
	Skip to main content
</a>

<div class="h-[100vh] w-full">
	<div class="container mx-auto space-y-8 p-4 md:p-8">
		<div id="main-content">
			<slot />
		</div>
	</div>
</div>

<style></style>
