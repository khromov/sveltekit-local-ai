<script lang="ts">
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';

	interface Props {
		onSampleRateChange: (sampleRate: number) => void;
	}

	let { onSampleRateChange }: Props = $props();

	let selectedSampleRate = $state(24000);

	const sampleRates = [
		{ value: 8000, label: '8 kHz' },
		{ value: 16000, label: '16 kHz' },
		{ value: 22050, label: '22.05 kHz' },
		{ value: 24000, label: '24 kHz (Native)' },
		{ value: 44100, label: '44.1 kHz' },
		{ value: 48000, label: '48 kHz' }
	];

	function handleSampleRateChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedSampleRate = parseInt(target.value);
		onSampleRateChange(selectedSampleRate);
	}
</script>

<div class="sample-rate-selector">
	<label for="sample-rate">Sample Rate:</label>
	<div class="select-wrapper">
		<select id="sample-rate" value={selectedSampleRate} onchange={handleSampleRateChange}>
			{#each sampleRates as rate (rate.value)}
				<option value={rate.value}>{rate.label}</option>
			{/each}
		</select>
		<span class="select-arrow">
			<ChevronDownIcon />
		</span>
	</div>
</div>

<style>
	.sample-rate-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		flex-shrink: 0;
	}

	.select-wrapper {
		position: relative;
		flex: 1;
		min-width: 140px;
	}

	select {
		width: 100%;
		padding: 0.5rem 2rem 0.5rem 0.75rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		appearance: none;
		box-shadow: var(--shadow-brutalist-small);
		font-family: var(--font-family-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
		transition: all 0.2s;
	}

	select:hover {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	select:focus {
		outline: none;
		background: var(--color-background-cream);
	}

	.select-arrow {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.select-arrow :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	@media (max-width: 600px) {
		.sample-rate-selector {
			flex-direction: column;
			align-items: stretch;
		}

		label {
			margin-bottom: 0.25rem;
		}

		.select-wrapper {
			width: 100%;
		}
	}
</style>
