<script lang="ts">
	import type { Post } from '$lib/post';

	let {
		post,
		index,
		isVisible,
		onPostClick,
		onImageLoad
	}: {
		post: Post;
		index: number;
		isVisible: boolean;
		onPostClick: (e: MouseEvent, postId: string) => void;
		onImageLoad: (postId: string) => void;
	} = $props();

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

	function checkImageLoaded(node: HTMLImageElement, postId: string) {
		if (node.complete && node.naturalWidth > 0) {
			onImageLoad(postId);
		}

		return {
			destroy() {}
		};
	}
</script>

<article class="[transform-style:preserve-3d]">
	<a
		href={`/posts/${post.id}`}
		class="block rounded-lg transition-all duration-500 focus:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(255_255_255/0.5)] {isVisible
			? 'translate-y-0 opacity-100'
			: 'translate-y-4 opacity-0'}"
		style="--rotate-x: 0deg; --rotate-y: 0deg; --scale: 1; transform-style: preserve-3d; perspective: 1000px;"
		onclick={(e) => onPostClick(e, post.id)}
		onmousemove={(e) => handleMouseMove(e, e.currentTarget)}
		onmouseleave={(e) => handleMouseLeave(e.currentTarget)}
		aria-label="View {post.description || `post ${index + 1}`} in full size"
	>
		<div
			class="transition-transform duration-100 ease-out hover:shadow-2xl"
			style="transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) scale(var(--scale));"
		>
			{#if post.description}
				<span class="sr-only">{post.description}</span>
			{/if}
			<img
				class="h-[300px] w-[300px] rounded-lg object-cover shadow-lg md:h-[500px] md:w-[500px]"
				style="view-transition-name: post-image-{post.id}"
				src={post.media_url}
				alt={post.description || `Post ${index + 1}`}
				loading="lazy"
				onload={() => onImageLoad(post.id)}
				use:checkImageLoaded={post.id}
			/>
		</div>
	</a>
</article>
