<script lang="ts">
	import type { PageData } from './$types';
	import { X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { focusTrap } from '$lib/focusTrap';

	let { data }: { data: PageData } = $props();
	let loading = $state(true);
	let imgElement = $state<HTMLImageElement>();
	let modalElement = $state<HTMLElement>();
	let portrait = $state(true);

	let post = $state(data.post);
	let largeUrl = $derived(post ? post.media_url.replace('/public', '/large') : '');

	function closeModal() {
		goto('/');
	}

	onMount(() => {
		const handleKeyup = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Escape':
					closeModal();
					break;
				case 'Enter':
				case ' ':
					// Allow space or enter to close the modal when it has focus
					if (e.target === modalElement) {
						e.preventDefault();
						closeModal();
					}
					break;
			}
		};
		document.addEventListener('keyup', handleKeyup, false);

		// Prevent background scrolling when modal is open
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('keyup', handleKeyup, false);
			document.body.style.overflow = '';
		};
	});

	$effect(() => {
		if (imgElement) {
			if (imgElement.complete) {
				loading = false;
				if (imgElement.width >= imgElement.height) {
					portrait = false;
				}
			} else {
				imgElement.addEventListener('load', () => {
					loading = false;
					if (imgElement && imgElement.width >= imgElement.height) {
						portrait = false;
					}
				});
			}
		}
	});
</script>

<svelte:head>
	{#if post}
		{#if post.description}
			<title>{post.description}</title>
		{/if}
		{#if post.media_url}
			<meta property="og:image" content={post.media_url} />
		{/if}
	{/if}
</svelte:head>

<div
	class="bg-surface-50 dark:bg-surface-950 fixed inset-0 flex items-center justify-center p-4"
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	aria-describedby="modal-description"
	tabindex="-1"
	bind:this={modalElement}
	use:focusTrap
	onclick={(e) => {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	}}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			if (e.target === e.currentTarget) {
				e.preventDefault();
				closeModal();
			}
		}
	}}
>
	<button
		onclick={closeModal}
		class="text-surface-950 dark:text-surface-50 focus:ring-surface-950/50 dark:focus:ring-surface-50/50 absolute top-4 right-4 z-10 rounded text-4xl transition-transform hover:scale-110 focus:ring-2 focus:outline-none"
		aria-label="Close image view"
	>
		<X />
	</button>

	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center">
			<img
				class="h-12 w-12 fill-slate-800 dark:fill-slate-100"
				src="/spinning-circles.svg"
				alt="Loading indicator"
			/>
		</div>
	{/if}

	{#if post}
		<div class="flex max-h-full max-w-full flex-col items-center">
			<img
				class="rounded-lg object-contain shadow-md shadow-slate-800 {portrait
					? 'max-h-[90vh] w-auto'
					: 'h-auto max-h-[90vh] max-w-[90vw]'}"
				style="view-transition-name: post-image-{post.id}"
				src={largeUrl}
				alt={post.description || 'Post image'}
				loading="lazy"
				bind:this={imgElement}
			/>
			{#if post.description}
				<h1 id="modal-title" class="sr-only">{post.description}</h1>
				<p
					id="modal-description"
					class="text-surface-950 dark:text-surface-50 mt-4 max-w-2xl px-4 text-center"
				>
					{post.description}
				</p>
			{:else}
				<h1 id="modal-title" class="sr-only">Post image</h1>
				<p id="modal-description" class="sr-only">Viewing post image in full size</p>
			{/if}
		</div>
	{/if}
</div>
