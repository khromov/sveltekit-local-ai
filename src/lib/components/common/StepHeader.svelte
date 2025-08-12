<script lang="ts">
	interface Props {
		stepNumber: number;
		title: string;
		backgroundColor?: string;
	}

	let { stepNumber, title, backgroundColor = 'var(--color-primary-dark)' }: Props = $props();
</script>

<h3 class="step-header" style="background: {backgroundColor};">
	<span class="step-number">Step {stepNumber}:</span>
	{title}
</h3>

<style>
	.step-header {
		margin-top: 0;
		margin-bottom: 1.25rem;
		font-family: var(--font-family-display);
		font-size: 1.75rem;
		color: var(--color-text-primary);
		text-align: center;
		letter-spacing: 2px;
		text-transform: uppercase;
		background: var(--color-primary-dark);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.step-number {
		background: var(--color-text-primary);
		color: var(--color-text-inverse);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 700;
		margin-right: 0.5rem;
		display: inline-block;
		transform: rotate(0deg);
	}

	@media (max-width: 600px) {
		.step-header {
			font-size: 1.5rem;
		}
	}
</style>
