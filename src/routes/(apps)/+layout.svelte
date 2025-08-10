<script lang="ts">
	import { dev } from '$app/environment';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>
		Local AI
	</title>

	{#if !dev}
	<script
			defer
			src="https://u.khromov.se/u.js"
			data-website-id="8b61040a-306f-4d99-95b3-0e925d631ec3"
		></script>
	{/if}
</svelte:head>

{@render children?.()}
