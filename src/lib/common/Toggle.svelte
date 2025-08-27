<script lang="ts">
	interface Props {
		checked?: boolean;
		label?: string;
		description?: string;
		disabled?: boolean;
		size?: 'small' | 'medium' | 'large';
		variant?: 'default' | 'success' | 'warning' | 'danger';
		onChange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		label = '',
		description = '',
		disabled = false,
		size = 'medium',
		variant = 'default',
		onChange
	}: Props = $props();

	function handleToggle() {
		if (disabled) return;
		checked = !checked;
		onChange?.(checked);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleToggle();
		}
	}

	const sizeMap = {
		small: { width: '40px', height: '24px', circleSize: '18px' },
		medium: { width: '50px', height: '28px', circleSize: '22px' },
		large: { width: '60px', height: '32px', circleSize: '26px' }
	};

	const variantColors = {
		default: 'var(--color-primary)',
		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		danger: 'var(--color-danger)'
	};
</script>

<div class="brutalist-toggle-group" class:disabled>
	<div
		class="toggle-wrapper"
		role="switch"
		aria-checked={checked}
		tabindex="0"
		onclick={handleToggle}
		onkeydown={handleKeydown}
		style="--toggle-width: {sizeMap[size].width}; --toggle-height: {sizeMap[size]
			.height}; --circle-size: {sizeMap[size].circleSize}; --toggle-color: {variantColors[
			variant
		]};"
	>
		<div class="toggle-track" class:checked class:disabled>
			<div class="toggle-thumb" class:checked></div>
		</div>

		{#if label || description}
			<div class="toggle-content">
				{#if label}
					<div class="toggle-label">{label}</div>
				{/if}
				{#if description}
					<div class="toggle-description">{description}</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.brutalist-toggle-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.toggle-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		outline: none;
		transition: all 0.2s ease;
		user-select: none;
	}

	.brutalist-toggle-group.disabled .toggle-wrapper {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.toggle-wrapper:focus-visible .toggle-track {
		box-shadow:
			var(--shadow-brutalist-large),
			0 0 0 2px var(--color-primary);
	}

	.toggle-track {
		position: relative;
		width: var(--toggle-width);
		height: var(--toggle-height);
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thick);
		border-radius: calc(var(--toggle-height) / 2);
		transition: all 0.2s ease;
		flex-shrink: 0;
		box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.1);
		transform: rotate(-1deg);
	}

	.toggle-track:hover {
		transform: rotate(0deg) translate(-1px, -1px);
		box-shadow:
			var(--shadow-brutalist-medium),
			inset 2px 2px 0 rgba(0, 0, 0, 0.1);
	}

	.toggle-track.checked {
		background: var(--toggle-color);
		transform: rotate(1deg) translate(-1px, -1px);
		box-shadow:
			var(--shadow-brutalist-medium),
			inset -2px -2px 0 rgba(0, 0, 0, 0.1);
	}

	.toggle-track.checked:hover {
		transform: rotate(0deg) translate(-2px, -2px);
		box-shadow:
			var(--shadow-brutalist-large),
			inset -2px -2px 0 rgba(0, 0, 0, 0.1);
	}

	.toggle-track.disabled {
		background: var(--color-background-disabled);
		transform: rotate(-1deg);
	}

	.toggle-track.disabled:hover {
		transform: rotate(-1deg);
		box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.1);
	}

	.toggle-thumb {
		position: absolute;
		top: 50%;
		left: 3px;
		width: var(--circle-size);
		height: var(--circle-size);
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		border-radius: 50%;
		transform: translateY(-50%);
		transition: all 0.2s ease;
		box-shadow: var(--shadow-brutalist-small);
	}

	.toggle-thumb.checked {
		left: calc(var(--toggle-width) - var(--circle-size) - 3px);
		background: var(--color-text-primary);
		transform: translateY(-50%) rotate(180deg);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.toggle-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.toggle-label {
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.toggle-description {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		font-weight: 500;
		line-height: 1.4;
	}

	@media (max-width: 600px) {
		.toggle-label {
			font-size: 0.9375rem;
		}

		.toggle-description {
			font-size: 0.8125rem;
		}
	}
</style>
