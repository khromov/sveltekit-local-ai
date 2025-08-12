<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		fixedHeight?: boolean;
	}

	let { children, fixedHeight = false }: Props = $props();
</script>

<div class="card-interface" class:fixed-height={fixedHeight}>
	<div class="floating-decoration decoration-1"></div>
	<div class="floating-decoration decoration-2"></div>

	{@render children?.()}
</div>

<style>
	.card-interface {
		position: relative;
		transform: rotate(0deg);
		animation: slideInChat 0.5s ease-out;
		display: flex;
		flex-direction: column;
	}

	.card-interface.fixed-height {
		height: calc(100vh - 4rem); /* Fixed height to constrain content */
		min-height: 500px; /* Minimum height for usability */
		max-height: calc(100vh - 2rem); /* Prevent growing too large */
	}

	@keyframes slideInChat {
		from {
			opacity: 0;
			transform: translateY(20px) rotate(0deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(0deg);
		}
	}

	.floating-decoration {
		position: absolute;
		background: linear-gradient(
			135deg,
			var(--color-primary-dark) 0%,
			var(--color-accent-pink) 100%
		);
		border: var(--border-brutalist-thick);
		opacity: 0.2;
		z-index: -1;
		pointer-events: none;
	}

	.decoration-1 {
		width: 80px;
		height: 80px;
		top: -20px;
		right: -20px;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		animation: float1 8s ease-in-out infinite;
	}

	.decoration-2 {
		width: 60px;
		height: 60px;
		bottom: 100px;
		left: -15px;
		border-radius: 70% 30% 30% 70% / 40% 60% 40% 60%;
		animation: float2 10s ease-in-out infinite;
	}

	@keyframes float1 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(-10px, 10px) rotate(180deg);
		}
	}

	@keyframes float2 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(10px, -10px) rotate(-180deg);
		}
	}

	@media (max-width: 600px) {
		.card-interface.fixed-height {
			height: calc(100vh - 3rem);
			min-height: 400px;
		}

		.decoration-1,
		.decoration-2 {
			display: none;
		}
	}
</style>
