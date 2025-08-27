<script lang="ts">
	interface Props {
		label?: string;
		checked?: boolean;
		disabled?: boolean;
		onChange?: (checked: boolean) => void;
		variant?: 'switch' | 'checkbox';
	}

	let {
		label,
		checked = $bindable(false),
		disabled = false,
		onChange,
		variant = 'switch'
	}: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (onChange) {
			onChange(target.checked);
		}
	}
</script>

<label class="toggle-wrapper {variant}" class:disabled>
	<input type="checkbox" bind:checked {disabled} onchange={handleChange} class="toggle-input" />
	<span class="toggle-slider"></span>
	{#if label}
		<span class="toggle-label">{label}</span>
	{/if}
</label>

<style>
	.toggle-wrapper {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		user-select: none;
		position: relative;
	}

	.toggle-wrapper.disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.toggle-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* Switch variant */
	.switch .toggle-slider {
		position: relative;
		display: inline-block;
		width: 48px;
		height: 24px;
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thick);
		border-radius: 24px;
		transition: all 0.3s;
		box-shadow: var(--shadow-brutalist-small);
	}

	.switch .toggle-slider::before {
		content: '';
		position: absolute;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--color-text-primary);
		border: var(--border-brutalist-thin);
		top: 1px;
		left: 2px;
		transition: all 0.3s;
		box-shadow: var(--shadow-brutalist-small);
	}

	.switch .toggle-input:checked + .toggle-slider {
		background: var(--color-success);
	}

	.switch .toggle-input:checked + .toggle-slider::before {
		transform: translateX(22px);
	}

	.switch:hover:not(.disabled) .toggle-slider {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	/* Checkbox variant */
	.checkbox .toggle-slider {
		display: inline-block;
		width: 20px;
		height: 20px;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 4px;
		position: relative;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-small);
	}

	.checkbox .toggle-slider::after {
		content: '';
		position: absolute;
		display: none;
		left: 5px;
		top: 1px;
		width: 6px;
		height: 10px;
		border: solid var(--color-text-primary);
		border-width: 0 3px 3px 0;
		transform: rotate(45deg);
	}

	.checkbox .toggle-input:checked + .toggle-slider {
		background: var(--color-success);
	}

	.checkbox .toggle-input:checked + .toggle-slider::after {
		display: block;
	}

	.checkbox:hover:not(.disabled) .toggle-slider {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.toggle-label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
</style>
