<script lang="ts">
	import CatIcon from 'virtual:icons/lucide/cat';
	import FlowerIcon from 'virtual:icons/lucide/flower';
	import MusicIcon from 'virtual:icons/lucide/music';

	interface Props {
		selectedModel: string | null;
		onModelChange: (model: 'kitten' | 'piper' | 'kokoro') => void;
	}

	let { selectedModel, onModelChange }: Props = $props();
</script>

<div class="model-switcher">
	<h3>
		<span class="step-number">Step 1:</span>
		Text-to-speech Model
	</h3>

	<div class="model-cards">
		<button
			class="model-card"
			class:active={selectedModel === 'kitten'}
			onclick={() => onModelChange('kitten')}
		>
			<div class="model-icon">
				<CatIcon />
			</div>
			<div class="model-info">
				<h4>Kitten TTS Nano</h4>
				<p>24MB • Best for edge devices</p>
			</div>
		</button>

		<button
			class="model-card"
			class:active={selectedModel === 'piper'}
			onclick={() => onModelChange('piper')}
		>
			<div class="model-icon">
				<MusicIcon />
			</div>
			<div class="model-info">
				<h4>Piper Voices</h4>
				<p>75MB • Better Quality • Fast</p>
			</div>
		</button>

		<button
			class="model-card"
			class:active={selectedModel === 'kokoro'}
			onclick={() => onModelChange('kokoro')}
		>
			<div class="model-icon">
				<FlowerIcon />
			</div>
			<div class="model-info">
				<h4>Kokoro</h4>
				<p>80MB • Highest Quality • Slow</p>
			</div>
		</button>
	</div>
</div>

<style>
	.model-switcher {
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-large);
		margin-bottom: 1.5rem;
		position: relative;
		transform: rotate(-0.2deg);
		animation: slideIn 0.4s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateY(10px) rotate(-0.2deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(-0.2deg);
			opacity: 1;
		}
	}

	h3 {
		margin: 0 0 1.25rem 0;
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
	}

	.model-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.model-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 1rem;
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thick);
		cursor: pointer;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-medium);
		text-align: center;
		position: relative;
		overflow: hidden;
		transform: rotate(0.5deg);
	}

	.model-card:nth-child(2) {
		transform: rotate(-0.3deg);
	}

	.model-card:nth-child(3) {
		transform: rotate(0.3deg);
	}

	.model-card:hover {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-background-pattern);
	}

	.model-card.active {
		background: var(--color-success);
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
		border-color: var(--color-text-primary);
	}

	.model-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-primary);
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		padding: 0.75rem;
		box-shadow: var(--shadow-brutalist-small);
	}

	.model-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	.model-info h4 {
		margin: 0 0 0.25rem 0;
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--color-text-primary);
	}

	.model-info p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-tertiary);
		font-weight: 500;
		line-height: 1.2;
	}

	@media (max-width: 768px) {
		.model-cards {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.model-card {
			flex-direction: row;
			justify-content: flex-start;
			text-align: left;
		}

		.model-icon {
			padding: 0.5rem;
		}

		.model-info {
			text-align: left;
		}
	}

	@media (max-width: 600px) {
		.model-switcher {
			padding: 1rem;
		}

		h3 {
			font-size: 1.5rem;
		}
	}
</style>
