<script lang="ts">
	interface Props {
		text: string;
	}

	let { text }: Props = $props();

	let words = $derived(text.trim() ? text.trim().split(/\s+/).length : 0);
	let characters = $derived(text.length);

	let stats = $derived([
		{ label: 'Words', value: words },
		{ label: 'Characters', value: characters }
	]);
</script>

<div class="text-statistics">
	{#each stats as stat (stat.label)}
		<div class="stat-item">
			<span class="stat-label">{stat.label}:</span>
			<span class="stat-value">{stat.value}</span>
		</div>
	{/each}
</div>

<style>
	.text-statistics {
		display: flex;
		gap: 1.5rem;
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
	}

	.stat-item {
		display: flex;
		gap: 0.375rem;
	}

	.stat-label {
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-value {
		font-weight: 700;
		color: var(--color-text-primary);
	}
</style>
