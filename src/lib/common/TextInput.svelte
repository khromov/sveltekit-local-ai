<script lang="ts">
	interface Props {
		label?: string;
		value?: string;
		placeholder?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
		disabled?: boolean;
		required?: boolean;
		icon?: any;
		onChange?: (value: string) => void;
	}

	let {
		label,
		value = $bindable(),
		placeholder = '',
		type = 'text',
		disabled = false,
		required = false,
		icon: Icon,
		onChange
	}: Props = $props();

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		if (onChange) {
			onChange(target.value);
		}
	}
</script>

<div class="text-input-wrapper">
	{#if label}
		<label class="input-label">
			{label}
			{#if required}
				<span class="required">*</span>
			{/if}
		</label>
	{/if}
	<div class="input-container" class:has-icon={Icon}>
		{#if Icon}
			<div class="input-icon">
				<Icon />
			</div>
		{/if}
		<input
			bind:value
			{type}
			{placeholder}
			{disabled}
			{required}
			oninput={handleInput}
			class="text-input"
			class:with-icon={Icon}
		/>
	</div>
</div>

<style>
	.text-input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}

	.input-label {
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

	.input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-icon {
		position: absolute;
		left: 0.875rem;
		display: flex;
		align-items: center;
		color: var(--color-text-secondary);
		pointer-events: none;
		z-index: 1;
	}

	.input-icon :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.text-input {
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-text-primary);
		transition: all 0.2s;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-small);
		box-sizing: border-box;
	}

	.text-input.with-icon {
		padding-left: 2.75rem;
	}

	.text-input:hover:not(:disabled) {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.text-input:focus {
		outline: none;
		border-color: var(--color-primary);
		background: var(--color-background-cream);
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.text-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		background: var(--color-background-disabled);
	}

	.text-input::placeholder {
		color: var(--color-text-disabled);
	}
</style>
