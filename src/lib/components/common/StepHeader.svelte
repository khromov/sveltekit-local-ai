<script lang="ts">
	interface Props {
		stepNumber: number;
		title: string;
		backgroundColor?: string;
	}

	let { stepNumber, title, backgroundColor = '#ffd93d' }: Props = $props();
</script>

<h3 class="step-header" style="background: {backgroundColor};">
	<span class="step-number">Step {stepNumber}:</span>
	{title}
</h3>

<style>
	.step-header {
		margin-top: 0;
		margin-bottom: 1.25rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.75rem;
		color: #000;
		text-align: center;
		letter-spacing: 2px;
		text-transform: uppercase;
		background: #ffd93d;
		padding: 0.5rem 1rem;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		transform: rotate(1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.step-number {
		background: #000;
		color: #fff;
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
