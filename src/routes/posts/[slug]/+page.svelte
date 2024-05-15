<script lang="ts">
	import type { PageData } from './$types';
	import { X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let loading = true;
	let imgElement: HTMLImageElement;
	let portrait = true;

	let post = data.post;
	$: largeUrl = post ? post.media_url.replace('/public', '/large') : '';
	onMount(() => {
		const handleKeyup = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				goto('/');
			}
		};
		document.addEventListener('keyup', handleKeyup, false);

		return () => {
			document.removeEventListener('keyup', handleKeyup, false);
		};
	});

	$: if (imgElement) {
		if (imgElement.complete) {
			loading = false;
			if (imgElement.width >= imgElement.height) {
				portrait = false;
			}
		} else {
			imgElement.addEventListener('load', () => {
				loading = false;
				if (imgElement.width >= imgElement.height) {
					portrait = false;
				}
			});
		}
	}
</script>

<a href="/" class="float-right text-4xl"> <X /> </a>
<div class="clear-both"></div>
<div class="fixed h-[50vh] w-[80vw] opacity-50">
	{#if loading}
		<img
			class="relative mx-auto h-full w-12 fill-slate-800 align-middle dark:fill-slate-100"
			src="/spinning-circles.svg"
			alt="Loading indicator"
		/>
	{/if}
</div>
{#if post}
	<img
		class="slate-900 mx-auto rounded-lg shadow-md shadow-slate-800 {portrait
			? 'max-h-[90vh]'
			: 'max-w-[70vw]'}"
		src={largeUrl}
		alt={post.description}
		loading="lazy"
		bind:this={imgElement}
	/>
{/if}
