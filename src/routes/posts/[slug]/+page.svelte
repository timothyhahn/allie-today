<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let post = data.post;
	$: largeUrl = post ? post.media_url.replace('/public', '/large') : '';
</script>

<a href="/" class="float-right text-4xl">
	x
</a>
<div class="clear-both"></div>
{#if post}
	<img class="max-w-full max-h-full mx-auto" src={largeUrl} alt={post.description} />
{/if}
