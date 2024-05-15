<script lang="ts">
	import { onMount } from 'svelte';
	import type { Post } from '$lib/post';

	let posts: Post[] = [];
	let page = 0;
	let done = false;
	let loading = false;
	let y = 0;

	onMount(() => {
		loadNextPage();
	});

	function loadNextPage() {
		if (done || loading) {
			return;
		}
		loading = true;
		fetch(`/api/posts?offset=${page * 10}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.posts.length === 0) {
					done = true;
				}
				posts = [...posts, ...data.posts];
			})
			.finally(() => {
				loading = false;
			});
	}

	$: if (y && y + window.innerHeight >= document.body.scrollHeight - 100) {
		if (!loading && !done) {
			page++;
			loadNextPage();
		}
	}
</script>

<h1 class="h1 text-center">Allie says, "sup"</h1>

<svelte:window bind:scrollY={y} />

<section class="grid grid-cols-2 gap-4 md:grid-cols-3">
	{#each posts as post}
		<a href={`posts/${post.id}`}>
			<div>
				{post.description || ''}
				<img
					class="h-[300px] w-[300px] rounded-lg object-cover md:h-[500px] md:w-[500px]"
					src={post.media_url}
					alt={post.description}
					loading="lazy"
				/>
			</div>
		</a>
	{/each}
</section>
