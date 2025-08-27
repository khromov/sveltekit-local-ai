<script lang="ts">
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';
	import CheckIcon from 'virtual:icons/lucide/check';

	interface Option {
		value: string | number;
		label: string;
		icon?: any;
		disabled?: boolean;
	}

	interface Props {
		label?: string;
		options: Option[];
		value?: string | number;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		onChange?: (value: string | number) => void;
	}

	let {
		label,
		options,
		value = $bindable(),
		placeholder = 'Select an option',
		disabled = false,
		required = false,
		onChange
	}: Props = $props();

	let isOpen = $state(false);
	let containerElement: HTMLDivElement | undefined = $state();

	$effect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerElement && !containerElement.contains(event.target as Node)) {
				isOpen = false;
			}
		}

		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	function handleSelect(option: Option) {
		if (option.disabled) return;

		value = option.value;
		isOpen = false;

		if (onChange) {
			onChange(option.value);
		}
	}

	function getSelectedLabel() {
		const selected = options.find((opt) => opt.value === value);
		return selected?.label || placeholder;
	}

	function getSelectedOption() {
		return options.find((opt) => opt.value === value);
	}
</script>

<div class="dropdown-wrapper" bind:this={containerElement}>
	{#if label}
		<label class="dropdown-label">
			{label}
			{#if required}
				<span class="required">*</span>
			{/if}
		</label>
	{/if}

	<button
		class="dropdown-button"
		class:open={isOpen}
		class:disabled
		onclick={() => !disabled && (isOpen = !isOpen)}
		type="button"
		{disabled}
	>
		<div class="dropdown-button-content">
			{#if getSelectedOption()?.icon}
				<span class="option-icon">
					<svelte:component this={getSelectedOption().icon} />
				</span>
			{/if}
			<span class="dropdown-value" class:placeholder={!value}>
				{getSelectedLabel()}
			</span>
		</div>
		<span class="dropdown-arrow" class:rotated={isOpen}>
			<ChevronDownIcon />
		</span>
	</button>

	{#if isOpen && !disabled}
		<div class="dropdown-menu">
			{#each options as option (option.value)}
				<button
					class="dropdown-option"
					class:selected={option.value === value}
					class:disabled={option.disabled}
					onclick={() => handleSelect(option)}
					type="button"
					disabled={option.disabled}
				>
					{#if option.icon}
						<span class="option-icon">
							<svelte:component this={option.icon} />
						</span>
					{/if}
					<span class="option-label">{option.label}</span>
					{#if option.value === value}
						<span class="option-check">
							<CheckIcon />
						</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.dropdown-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		position: relative;
	}

	.dropdown-label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.required {
		color: var(--color-danger);
		margin-left: 0.25rem;
	}

	.dropdown-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-small);
		width: 100%;
		text-align: left;
		color: var(--color-text-primary);
	}

	.dropdown-button:hover:not(.disabled) {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.dropdown-button.open {
		background: var(--color-background-cream);
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.dropdown-button.disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: var(--color-background-disabled);
	}

	.dropdown-button-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		overflow: hidden;
	}

	.dropdown-value {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.dropdown-value.placeholder {
		color: var(--color-text-disabled);
	}

	.dropdown-arrow {
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.dropdown-arrow :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.dropdown-arrow.rotated {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 6px;
		box-shadow: var(--shadow-brutalist-large);
		max-height: 240px;
		overflow-y: auto;
		z-index: 100;
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

	.dropdown-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: none;
		border: none;
		border-bottom: var(--border-brutalist-thin);
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-text-primary);
		transition: all 0.15s;
		font-family: var(--font-family-primary);
		width: 100%;
		text-align: left;
	}

	.dropdown-option:last-child {
		border-bottom: none;
	}

	.dropdown-option:hover:not(.disabled) {
		background: var(--color-background-tertiary);
	}

	.dropdown-option.selected {
		background: var(--color-success);
		font-weight: 700;
	}

	.dropdown-option.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.option-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.option-icon :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.option-label {
		flex: 1;
	}

	.option-check {
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		flex-shrink: 0;
		margin-left: auto;
	}

	.option-check :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	/* Custom scrollbar */
	.dropdown-menu::-webkit-scrollbar {
		width: 8px;
	}

	.dropdown-menu::-webkit-scrollbar-track {
		background: var(--color-background-tertiary);
	}

	.dropdown-menu::-webkit-scrollbar-thumb {
		background: var(--color-text-primary);
		border-radius: 4px;
	}

	.dropdown-menu::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-secondary);
	}
</style>
