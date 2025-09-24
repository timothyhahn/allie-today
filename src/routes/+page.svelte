<script lang="ts">
	import type { Post } from '$lib/post';
	import type { PageData } from './$types';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import ScrollToTopButton from '$lib/components/ScrollToTopButton.svelte';
	import PostCard from '$lib/components/PostCard.svelte';

	let { data }: { data: PageData } = $props();

	let posts = $state<Post[]>(data.posts);
	let page = $state(0);
	let done = $state(false);
	let loading = $state(false);
	let y = $state(0);
	let visiblePosts = $state<Set<string>>(new Set());
	let loadedImages = $state<Set<string>>(new Set());
	let animationQueue = $state<string[]>([]);

	$effect(() => {
		if (posts.length > 0 && animationQueue.length === 0) {
			queuePostsForAnimation(posts.map((p) => p.id));
		}
	});

	onMount(() => {
		const savedState = sessionStorage.getItem('galleryState');
		if (savedState) {
			try {
				const state = JSON.parse(savedState);
				// Check if data is fresh (less than 5 minutes old)
				if (Date.now() - state.timestamp < 5 * 60 * 1000) {
					posts = state.posts;
					page = state.page;
					done = state.done;

					// Make all restored posts immediately visible (no animation)
					visiblePosts = new Set(posts.map((p) => p.id));
					loadedImages = new Set(posts.map((p) => p.id));

					setTimeout(() => {
						window.scrollTo(0, state.scrollY);
					}, 0);
				}
				sessionStorage.removeItem('galleryState');
			} catch {
				sessionStorage.removeItem('galleryState');
			}
		}

		const handleGlobalKeydown = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				return;
			}

			switch (e.key) {
				case 'Home':
					e.preventDefault();
					scrollToTop();
					break;
				case 'End':
					e.preventDefault();
					window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
					break;
			}
		};

		document.addEventListener('keydown', handleGlobalKeydown);

		return () => {
			document.removeEventListener('keydown', handleGlobalKeydown);
		};
	});

	onDestroy(() => {});

	function handlePostClick(e: MouseEvent, postId: string) {
		const state = {
			posts,
			page,
			done,
			scrollY: y,
			timestamp: Date.now()
		};
		sessionStorage.setItem('galleryState', JSON.stringify(state));
		goto(`/posts/${postId}`);
		e.preventDefault();
	}

	function handleImageLoad(postId: string) {
		loadedImages = new Set([...loadedImages, postId]);
		processAnimationQueue();
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function processAnimationQueue() {
		const readyToAnimate = animationQueue.filter(
			(id) => loadedImages.has(id) && !visiblePosts.has(id)
		);

		readyToAnimate.forEach((id, index) => {
			setTimeout(() => {
				visiblePosts = new Set([...visiblePosts, id]);
				animationQueue = animationQueue.filter((qId) => qId !== id);
			}, index * 50);
		});
	}

	function queuePostsForAnimation(postIds: string[]) {
		animationQueue = [...animationQueue, ...postIds];
		processAnimationQueue();
	}

	function loadNextPage() {
		if (done || loading) {
			return;
		}
		loading = true;
		const previousLength = posts.length;
		fetch(`/api/posts?offset=${page * 12}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.posts.length === 0) {
					done = true;
				}
				posts = [...posts, ...data.posts];
				const newPostIds = posts.slice(previousLength).map((p) => p.id);
				queuePostsForAnimation(newPostIds);
			})
			.finally(() => {
				loading = false;
			});
	}

	$effect(() => {
		if (y && y + window.innerHeight >= document.body.scrollHeight - 100) {
			if (!loading && !done) {
				page++;
				loadNextPage();
			}
		}
	});
</script>

<svelte:window bind:scrollY={y} />

<div class="container mx-auto p-4 md:p-8">
	<Header />

	<main>
		<section class="grid grid-cols-2 gap-4 md:grid-cols-3" aria-label="Photo gallery">
			{#each posts as post, index}
				<PostCard
					{post}
					{index}
					isVisible={visiblePosts.has(post.id)}
					onPostClick={handlePostClick}
					onImageLoad={handleImageLoad}
				/>
			{/each}
		</section>
	</main>
</div>

<ScrollToTopButton show={y > 0} {scrollToTop} />
