<script lang="ts">
	import { onMount } from 'svelte';

	interface Post {
		id: string;
		description: string | undefined;
		media_url: string;
		post_type: string;

	}
	let posts: Post[] = [];
	let page = 0;
	let done = false;
	let loading = false;
	let y = 0;
	onMount(() => {
		loadNextPage();
	})

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

	$: if (y && y + window.innerHeight >= (document.body.scrollHeight - 10)) {
		if (!loading && !done) {
			page++;
			loadNextPage();
		}
	}
</script>
<h1 class="h1 text-center">Allie says, "sup"</h1>

<svelte:window bind:scrollY={y} />

<section class="grid grid-cols-2 md:grid-cols-3 gap-4">
	{#each posts as post}
		<div>
			{post.description || ''}
			<img class="h-[500px] w-[500px] object-cover rounded-lg" src={post.media_url} alt={post.description}>
		</div>
	{/each}
</section>