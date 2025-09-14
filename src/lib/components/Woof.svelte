<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const dogSounds = ['ruff', 'bork', 'boof', 'woof', 'bark'];
	const initialIndex = Math.floor(Math.random() * dogSounds.length);
	let currentSoundIndex = $state(initialIndex);
	let displayedSound = $state(dogSounds[initialIndex]);
	let soundLetters = $derived(displayedSound.split(''));

	let woofAnimating = $state(false);
	let transitioning = $state(false);
	let animationTimer: ReturnType<typeof setTimeout>;

	function changeWordAndAnimate() {
		transitioning = true;

		setTimeout(() => {
			currentSoundIndex = (currentSoundIndex + 1) % dogSounds.length;
			displayedSound = dogSounds[currentSoundIndex];
		}, 200);

		setTimeout(() => {
			transitioning = false;

			setTimeout(() => {
				woofAnimating = true;
				setTimeout(() => {
					woofAnimating = false;
				}, 1200);
			}, 300);
		}, 400);

		const nextDelay = Math.random() * 20000 + 10000; // 10-30 seconds
		animationTimer = setTimeout(changeWordAndAnimate, nextDelay);
	}

	function initialWoofAnimation() {
		woofAnimating = true;
		setTimeout(() => {
			woofAnimating = false;
		}, 1200);

		const nextDelay = Math.random() * 20000 + 10000; // 10-30 seconds
		animationTimer = setTimeout(changeWordAndAnimate, nextDelay);
	}

	onMount(() => {
		setTimeout(() => {
			initialWoofAnimation();
		}, 500);
	});

	onDestroy(() => {
		if (animationTimer) {
			clearTimeout(animationTimer);
		}
	});
</script>

<span class="woof-text {transitioning ? 'transitioning' : ''}" aria-label={displayedSound}>
	{#each soundLetters as letter, i}
		<span
			class="woof-letter {woofAnimating ? 'woof-wave' : ''}"
			style="animation-delay: {i * 0.1}s"
			aria-hidden="true">{letter}</span
		>
	{/each}
</span>

<style>
	.woof-text {
		display: inline-block;
		position: relative;
	}

	.woof-text.transitioning {
		animation: slideTransition 0.4s ease-in-out;
	}

	@keyframes slideTransition {
		0% {
			transform: translateY(0);
			opacity: 1;
		}
		45% {
			transform: translateY(-20px);
			opacity: 0;
		}
		55% {
			transform: translateY(20px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.woof-letter {
		display: inline-block;
		transition: transform 0.1s ease;
	}

	.woof-wave {
		animation: wave 0.8s ease-in-out;
	}

	@keyframes wave {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		25% {
			transform: translateY(-6px) rotate(-5deg);
		}
		50% {
			transform: translateY(0px) rotate(0deg);
		}
		75% {
			transform: translateY(-3px) rotate(3deg);
		}
	}
</style>
