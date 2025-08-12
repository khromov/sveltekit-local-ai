<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		rotation?: number;
		animationDelay?: number;
	}

	let { children, rotation = 0.5, animationDelay = 0 }: Props = $props();
</script>

<div
	class="section-card"
	style="transform: rotate({rotation}deg); animation-delay: {animationDelay}s;"
>
	{@render children?.()}
</div>

<style>
	.section-card {
		background: #fff;
		border: 4px solid #000;
		padding: 1.5rem;
		box-shadow: 6px 6px 0 #000;
		margin-bottom: 1.5rem;
		position: relative;
		animation: slideIn 0.4s ease-out;
		animation-fill-mode: both;
	}

	@keyframes slideIn {
		from {
			transform: translateY(10px) rotate(var(--rotation, 0.5deg));
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(var(--rotation, 0.5deg));
			opacity: 1;
		}
	}

	@media (max-width: 600px) {
		.section-card {
			padding: 1.25rem;
		}
	}
</style>
