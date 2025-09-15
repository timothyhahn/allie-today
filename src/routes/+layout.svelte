<script>
	import '../app.css';

	// Simple dark mode watcher equivalent to what SkeletonLabs used to provide
	function autoModeWatcher() {
		const htmlEl = document.documentElement;
		const modeValue = localStorage.getItem('modeOSPrefers') || 'system';

		if (
			modeValue === 'dark' ||
			(modeValue === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			htmlEl.classList.add('dark');
		} else {
			htmlEl.classList.remove('dark');
		}
	}
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>

<a
	href="#main-content"
	class="sr-only z-50 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
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
