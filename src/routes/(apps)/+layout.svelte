<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="app-layout">
	{@render children?.()}
</div>

<style>
	.app-layout {
		padding: 1rem;
	}
</style>
