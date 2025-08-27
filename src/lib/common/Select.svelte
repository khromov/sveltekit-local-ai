<script lang="ts">
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';

	interface Option {
		value: string | number;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		options: Option[];
		value?: string | number;
		placeholder?: string;
		label?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
		fullWidth?: boolean;
		Icon?: any;
	}

	let {
		options,
		value = $bindable(),
		placeholder = 'Select an option...',
		label = '',
		error = '',
		disabled = false,
		required = false,
		fullWidth = false,
		Icon
	}: Props = $props();

	let isOpen = $state(false);
	let selectElement: HTMLElement | undefined = $state();

	function toggleSelect() {
		if (disabled) return;
		isOpen = !isOpen;
	}

	function selectOption(option: Option) {
		if (option.disabled) return;
		value = option.value;
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (selectElement && !selectElement.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const selectedOption = $derived(options.find((opt) => opt.value === value));
</script>

<div
	class="brutalist-select-group"
	class:full-width={fullWidth}
	class:has-error={error}
	class:disabled
>
	{#if label}
		<label class="select-label">
			{label}
			{#if required}
				<span class="required">*</span>
			{/if}
		</label>
	{/if}

	<div bind:this={selectElement} class="select-wrapper">
		<button
			type="button"
			class="select-trigger"
			class:open={isOpen}
			class:has-icon={Icon}
			onclick={toggleSelect}
			{disabled}
		>
			{#if Icon}
				<span class="select-icon">
					<Icon />
				</span>
			{/if}

			<span class="select-value">
				{selectedOption?.label || placeholder}
			</span>

			<span class="arrow-icon" class:rotated={isOpen}>
				<ChevronDownIcon />
			</span>
		</button>

		{#if isOpen}
			<div class="select-dropdown">
				{#each options as option (option.value)}
					<button
						type="button"
						class="select-option"
						class:selected={option.value === value}
						class:disabled={option.disabled}
						onclick={() => selectOption(option)}
						disabled={option.disabled}
					>
						{option.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if error}
		<div class="select-error">{error}</div>
	{/if}
</div>

<style>
	.brutalist-select-group {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: auto;
	}

	.brutalist-select-group.full-width {
		width: 100%;
	}

	.select-label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.required {
		color: var(--color-danger);
		font-size: 1rem;
	}

	.select-wrapper {
		position: relative;
		width: 100%;
		min-width: 200px;
	}

	.select-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		font-family: var(--font-family-primary);
		color: var(--color-text-primary);
		text-align: left;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-brutalist-small);
		transform: rotate(-0.3deg);
	}

	.select-trigger:hover:not(:disabled) {
		transform: translate(-1px, -1px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.select-trigger.open {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
		background: var(--color-primary);
	}

	.brutalist-select-group.disabled .select-trigger {
		background: var(--color-background-disabled);
		color: var(--color-text-disabled);
		cursor: not-allowed;
		opacity: 0.6;
		transform: rotate(-0.3deg);
	}

	.brutalist-select-group.disabled .select-trigger:hover {
		transform: rotate(-0.3deg);
		box-shadow: var(--shadow-brutalist-small);
	}

	.brutalist-select-group.has-error .select-trigger {
		border-color: var(--color-danger);
		background: var(--color-background-light-pink);
	}

	.select-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.select-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.select-value {
		flex: 1;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.arrow-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.arrow-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.arrow-icon.rotated {
		transform: rotate(180deg);
	}

	.select-dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		box-shadow: var(--shadow-brutalist-large);
		max-height: 300px;
		overflow-y: auto;
		z-index: 1000;
		animation: dropdownOpen 0.2s ease-out;
	}

	@keyframes dropdownOpen {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.select-option {
		width: 100%;
		padding: 0.875rem 1rem;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
		font-family: var(--font-family-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		transition: background 0.15s;
		border-bottom: var(--border-brutalist-thin);
	}

	.select-option:last-child {
		border-bottom: none;
	}

	.select-option:hover:not(:disabled) {
		background: var(--color-background-tertiary);
	}

	.select-option.selected {
		background: var(--color-success);
	}

	.select-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--color-background-disabled);
	}

	.select-error {
		font-size: 0.75rem;
		color: var(--color-text-danger);
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		background: var(--color-background-light-pink);
		border: var(--border-brutalist-thin);
		border-color: var(--color-danger);
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.select-dropdown::-webkit-scrollbar {
		width: 8px;
	}

	.select-dropdown::-webkit-scrollbar-track {
		background: var(--color-background-tertiary);
	}

	.select-dropdown::-webkit-scrollbar-thumb {
		background: var(--color-text-primary);
		border-radius: 4px;
	}

	@media (max-width: 600px) {
		.select-wrapper {
			min-width: auto;
		}

		.select-trigger {
			padding: 0.75rem;
			font-size: 0.9375rem;
		}
	}
</style>
