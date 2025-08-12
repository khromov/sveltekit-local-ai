<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
		disabled?: boolean;
	}

	let { children, disabled = false }: Props = $props();
</script>

<div class="input-area" class:disabled>
	{@render children?.()}
</div>

<style>
	.input-area {
		padding: 1rem 1.25rem;
		border-top: 3px solid #000;
		background: #f5f5f5;
		box-sizing: border-box;
		flex: 0 0 auto;
		transition: all 0.3s ease;
	}

	.input-area.disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	@media (max-width: 600px) {
		.input-area {
			padding: 0.875rem 1rem;
		}
	}
</style>
