<script lang="ts">
	import Woof from './Woof.svelte';
	import DarkModeToggle from './DarkModeToggle.svelte';
</script>

<header class="mb-8 flex items-center justify-between">
	<div></div>
	<h1 class="font-heading flex-1 text-center text-4xl font-normal md:text-5xl">
		Allie says, "<Woof />"
	</h1>
	<DarkModeToggle />
</header>
