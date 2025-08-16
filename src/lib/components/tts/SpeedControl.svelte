<script lang="ts">
	interface Props {
		speed: number;
		onSpeedChange: (speed: number) => void;
	}

	let { speed, onSpeedChange }: Props = $props();

	function handleSpeedChange(event: Event) {
		const target = event.target as HTMLInputElement;
		onSpeedChange(parseFloat(target.value));
	}
</script>

<div class="speed-control">
	<label for="speed-control">Speed:</label>
	<div class="speed-input-wrapper">
		<input
			id="speed-control"
			type="range"
			value={speed}
			oninput={handleSpeedChange}
			min="0.5"
			max="2"
			step="0.1"
		/>
		<div class="speed-value">{speed}x</div>
	</div>
</div>

<style>
	.speed-control {
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

	.speed-input-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
	}

	input[type="range"] {
		flex: 1;
		height: 8px;
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		outline: none;
		appearance: none;
		cursor: pointer;
	}

	input[type="range"]::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		background: var(--color-primary);
		border: var(--border-brutalist-thick);
		border-radius: 50%;
		cursor: pointer;
		box-shadow: var(--shadow-brutalist-small);
		transition: all 0.15s;
	}

	input[type="range"]::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		background: var(--color-primary-hover);
	}

	input[type="range"]::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: var(--color-primary);
		border: var(--border-brutalist-thick);
		border-radius: 50%;
		cursor: pointer;
		box-shadow: var(--shadow-brutalist-small);
		transition: all 0.15s;
	}

	input[type="range"]::-moz-range-thumb:hover {
		transform: scale(1.1);
		background: var(--color-primary-hover);
	}

	.speed-value {
		min-width: 3rem;
		padding: 0.25rem 0.5rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		font-size: 0.875rem;
		font-weight: 700;
		text-align: center;
		box-shadow: var(--shadow-brutalist-small);
		color: var(--color-text-primary);
	}
</style>