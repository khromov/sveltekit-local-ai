<script lang="ts">
	interface Props {
		label?: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		showValue?: boolean;
		unit?: string;
		onChange?: (value: number) => void;
	}

	let {
		label,
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		showValue = true,
		unit = '',
		onChange
	}: Props = $props();

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = parseFloat(target.value);
		if (onChange) {
			onChange(newValue);
		}
	}

	$: percentage = ((value - min) / (max - min)) * 100;
</script>

<div class="slider-wrapper">
	{#if label}
		<div class="slider-header">
			<label class="slider-label">{label}</label>
			{#if showValue}
				<span class="slider-value">{value}{unit}</span>
			{/if}
		</div>
	{/if}

	<div class="slider-container">
		<input
			type="range"
			bind:value
			{min}
			{max}
			{step}
			{disabled}
			oninput={handleInput}
			class="slider"
			style="--percentage: {percentage}%"
		/>
		<div class="slider-track">
			<div class="slider-fill" style="width: {percentage}%"></div>
		</div>
	</div>

	{#if !label && showValue}
		<div class="slider-value-standalone">{value}{unit}</div>
	{/if}
</div>

<style>
	.slider-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.slider-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.slider-label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.slider-value,
	.slider-value-standalone {
		padding: 0.25rem 0.5rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		box-shadow: var(--shadow-brutalist-small);
		border-radius: 4px;
	}

	.slider-value-standalone {
		align-self: center;
		margin-top: 0.5rem;
	}

	.slider-container {
		position: relative;
		width: 100%;
		height: 24px;
		display: flex;
		align-items: center;
	}

	.slider {
		position: absolute;
		width: 100%;
		height: 8px;
		background: transparent;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
		z-index: 2;
	}

	.slider:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.slider-track {
		position: absolute;
		width: 100%;
		height: 8px;
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		overflow: hidden;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
		pointer-events: none;
	}

	.slider-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-warning) 100%);
		transition: width 0.1s ease;
	}

	/* Webkit browsers (Chrome, Safari) */
	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		background: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 50%;
		cursor: pointer;
		box-shadow: var(--shadow-brutalist-small);
		transition: all 0.15s;
	}

	.slider::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		background: var(--color-primary);
	}

	/* Firefox */
	.slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 50%;
		cursor: pointer;
		box-shadow: var(--shadow-brutalist-small);
		transition: all 0.15s;
		border-color: var(--color-border-primary);
	}

	.slider::-moz-range-thumb:hover {
		transform: scale(1.1);
		background: var(--color-primary);
	}
</style>
