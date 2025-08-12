<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		disabled?: boolean;
	}

	let { children, disabled = false }: Props = $props();
</script>

<div class="content-area" class:disabled>
	{@render children?.()}
</div>

<style>
	.content-area {
		padding: 1.5rem;
		background: #fff;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-sizing: border-box;
		min-height: 0;
		transition: all 0.3s ease;
	}

	.content-area.disabled {
		opacity: 0.3;
		pointer-events: none;
		filter: grayscale(50%);
	}

	@media (max-width: 600px) {
		.content-area {
			padding: 1rem;
			min-height: 0;
		}
	}
</style>
