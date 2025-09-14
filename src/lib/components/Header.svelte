<script lang="ts">
	import Woof from './Woof.svelte';
	import DarkModeToggle from './DarkModeToggle.svelte';
</script>

<header class="mb-8 flex items-center justify-between">
	<div></div>
	<h1 class="h1 flex-1 text-center">
		Allie says, "<Woof />"
	</h1>
	<DarkModeToggle />
</header>
