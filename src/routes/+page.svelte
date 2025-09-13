<script lang="ts">
	import type { Post } from '$lib/post';
	import type { PageData } from './$types';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import ScrollToTopButton from '$lib/components/ScrollToTopButton.svelte';

	export let data: PageData;

	let posts: Post[] = data.posts;
	let page = 0;
	let done = false;
	let loading = false;
	let y = 0;
	let visiblePosts: Set<string> = new Set();
	let loadedImages: Set<string> = new Set();
	let animationQueue: string[] = [];
	let isDarkMode = false;
	let woofAnimating = false;
	let animationTimer: ReturnType<typeof setTimeout>;

	$: if (posts.length > 0 && animationQueue.length === 0) {
		queuePostsForAnimation(posts.map((p) => p.id));
	}

	function triggerWoofAnimation() {
		woofAnimating = true;
		setTimeout(() => {
			woofAnimating = false;
		}, 1200); // Animation duration (0.8s animation + 0.3s delay for last letter)

		const nextDelay = Math.random() * 20000 + 40000; // 40-60 seconds
		animationTimer = setTimeout(triggerWoofAnimation, nextDelay);
	}

	onMount(() => {
		isDarkMode = document.documentElement.classList.contains('dark');

		setTimeout(() => {
			triggerWoofAnimation();
		}, 500);

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
			} catch (e) {
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

	onDestroy(() => {
		if (animationTimer) {
			clearTimeout(animationTimer);
		}
	});

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

	function checkImageLoaded(node: HTMLImageElement, postId: string) {
		if (node.complete && node.naturalWidth > 0) {
			handleImageLoad(postId);
		}

		return {
			destroy() {}
		};
	}

	function handleMouseMove(e: MouseEvent, postEl: HTMLElement) {
		const rect = postEl.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const maxTilt = 5;

		const rotateX = ((y - centerY) / centerY) * -maxTilt;
		const rotateY = ((x - centerX) / centerX) * maxTilt;

		postEl.style.setProperty('--rotate-x', `${rotateX}deg`);
		postEl.style.setProperty('--rotate-y', `${rotateY}deg`);
		postEl.style.setProperty('--scale', '1.05');
	}

	function handleMouseLeave(postEl: HTMLElement) {
		postEl.style.setProperty('--rotate-x', '0deg');
		postEl.style.setProperty('--rotate-y', '0deg');
		postEl.style.setProperty('--scale', '1');
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function toggleDarkMode() {
		const htmlElement = document.documentElement;
		isDarkMode = !isDarkMode;

		if (isDarkMode) {
			htmlElement.classList.add('dark');
			localStorage.setItem('modeUserPrefers', 'dark');
		} else {
			htmlElement.classList.remove('dark');
			localStorage.setItem('modeUserPrefers', 'light');
		}
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

	$: if (y && y + window.innerHeight >= document.body.scrollHeight - 100) {
		if (!loading && !done) {
			page++;
			loadNextPage();
		}
	}
</script>

<Header {isDarkMode} {woofAnimating} {toggleDarkMode} />

<svelte:window bind:scrollY={y} />

<main>
	<section class="grid grid-cols-2 gap-4 md:grid-cols-3" aria-label="Photo gallery">
		{#each posts as post, index}
			<article class="post-card">
				<a
					href={`/posts/${post.id}`}
					class="block rounded-lg transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 {visiblePosts.has(
						post.id
					)
						? 'translate-y-0 opacity-100'
						: 'translate-y-4 opacity-0'}"
					style="--rotate-x: 0deg; --rotate-y: 0deg; --scale: 1; transform-style: preserve-3d; perspective: 1000px;"
					on:click={(e) => handlePostClick(e, post.id)}
					on:mousemove={(e) => handleMouseMove(e, e.currentTarget)}
					on:mouseleave={(e) => handleMouseLeave(e.currentTarget)}
					aria-label="View {post.description || `post ${index + 1}`} in full size"
				>
					<div
						class="image-container"
						style="transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) scale(var(--scale)); transition: transform 0.1s ease-out;"
					>
						{#if post.description}
							<span class="sr-only">{post.description}</span>
						{/if}
						<img
							class="h-[300px] w-[300px] rounded-lg object-cover shadow-lg md:h-[500px] md:w-[500px]"
							src={post.media_url}
							alt={post.description || `Post ${index + 1}`}
							loading="lazy"
							on:load={() => handleImageLoad(post.id)}
							use:checkImageLoaded={post.id}
						/>
					</div>
				</a>
			</article>
		{/each}
	</section>
</main>

<ScrollToTopButton show={y > 0} {scrollToTop} />

<style>
	.post-card {
		transform-style: preserve-3d;
	}

	.post-card:hover .image-container {
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
	}
</style>
