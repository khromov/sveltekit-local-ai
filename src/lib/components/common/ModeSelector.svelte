<script lang="ts">
	interface ModeOption {
		id: string;
		icon: any;
		label: string;
	}

	interface Props {
		modes: ModeOption[];
		selectedMode: string;
		onModeChange: (modeId: string) => void;
		layout?: 'horizontal' | 'vertical';
		rotation?: number;
		backgroundColor?: string;
	}

	let {
		modes,
		selectedMode,
		onModeChange,
		layout = 'horizontal',
		rotation = -0.3,
		backgroundColor = 'var(--color-background-main)'
	}: Props = $props();
</script>

<div
	class="mode-selector"
	style:transform="rotate({rotation}deg)"
	style:background={backgroundColor}
>
	<div class="mode-buttons" class:vertical={layout === 'vertical'}>
		{#each modes as mode (mode.id)}
			<button
				class="mode-btn"
				class:active={selectedMode === mode.id}
				onclick={() => onModeChange(mode.id)}
			>
				<span class="mode-icon">
					<mode.icon />
				</span>
				{mode.label}
			</button>
		{/each}
	</div>
</div>

<style>
	.mode-selector {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: var(--shadow-brutalist-medium);
	}

	.mode-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.mode-buttons.vertical {
		flex-direction: column;
	}

	.mode-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem;
		background: #f0f0f0;
		border: 3px solid #000;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-shadow: 4px 4px 0 #000;
		min-width: 140px;
	}

	.mode-btn:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
		background: #e0e0e0;
	}

	.mode-btn.active {
		background: #98fb98;
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
	}

	.mode-btn.active:hover {
		background: #90ee90;
	}

	.mode-icon {
		font-size: 2rem;
		display: flex;
		align-items: center;
		color: #000;
	}

	.mode-icon :global(svg) {
		width: 2rem;
		height: 2rem;
	}

	@media (max-width: 600px) {
		.mode-buttons {
			flex-direction: column;
			gap: 0.75rem;
		}

		.mode-btn {
			min-width: auto;
			width: 100%;
		}
	}
</style>
