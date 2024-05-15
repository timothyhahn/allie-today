<script>
	import '../app.css';
	import { autoModeWatcher } from '@skeletonlabs/skeleton';
</script>

<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>
<main class="h-[100vh] w-full">
	<div class="container mx-auto space-y-8 p-4 md:p-8">
		<slot />
	</div>
</main>

<style></style>
