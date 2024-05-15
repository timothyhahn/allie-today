<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let loading = true;
	let imgElement: HTMLImageElement;


	let post = data.post;
	$: largeUrl = post ? post.media_url.replace('/public', '/large') : '';

	$: if (imgElement) {
		if (imgElement.complete) {
			loading = false;
		} else {
			imgElement.addEventListener('load', () => {
			loading = false;
			});
		}
	}
</script>

<a href="/" class="float-right text-4xl">
	x
</a>
<div class="clear-both"></div>
<div class="fixed h-[50vh] w-[80vw] opacity-50">
	{#if loading}
		<img
			class="mx-auto relative h-full w-12 align-middle"
			src="/spinning-circles.svg"
			alt="Loading indicator"
		/>
	{/if}
</div>
{#if post}
	<img class="max-w-full max-h-full mx-auto" src={largeUrl} alt={post.description} loading="lazy" bind:this={imgElement} />
{/if}
