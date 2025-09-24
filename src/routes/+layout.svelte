<script>
	import '../app.css';
</script>

<a
	href="#main-content"
	class="bg-primary sr-only z-50 rounded-md px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
	Skip to main content
</a>

<div
	class="bg-surface-50 text-surface-950 dark:bg-surface-950 dark:text-surface-50 min-h-screen w-full"
>
	<div id="main-content">
		<slot />
	</div>
</div>
