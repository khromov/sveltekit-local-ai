<script lang="ts">
	interface Props {
		title: string;
		items: string[];
	}

	let { title, items }: Props = $props();
</script>

<div class="info-box">
	<h4>{title}</h4>
	<ul>
		{#each items as item, index (index)}
			<li>{item}</li>
		{/each}
	</ul>
</div>

<style>
	.info-box {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		padding: 1.5rem;
		border-radius: 8px;
		transform: rotate(-0.2deg);
		margin-top: 2rem;
	}

	.info-box h4 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: var(--font-family-display);
	}

	.info-box ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.info-box li {
		position: relative;
		padding-left: 1.5rem;
		margin-bottom: 0.75rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.info-box li:last-child {
		margin-bottom: 0;
	}

	.info-box li::before {
		content: '▶';
		position: absolute;
		left: 0;
		color: var(--color-accent-primary);
		font-size: 0.75rem;
		top: 0.1rem;
	}

	.info-box li:hover {
		color: var(--color-text-primary);
	}
</style>
