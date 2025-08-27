<script lang="ts">
	interface Props {
		value?: string | number;
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel';
		placeholder?: string;
		label?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
		fullWidth?: boolean;
		Icon?: any;
		rows?: number;
	}

	let {
		value = $bindable(''),
		type = 'text',
		placeholder = '',
		label = '',
		error = '',
		disabled = false,
		required = false,
		fullWidth = false,
		Icon,
		rows = 1
	}: Props = $props();

	let focused = $state(false);
	let inputElement: HTMLInputElement | HTMLTextAreaElement | undefined = $state();

	const isMultiline = rows > 1;

	export function focus() {
		inputElement?.focus();
	}
</script>

<div
	class="brutalist-input-group"
	class:full-width={fullWidth}
	class:has-error={error}
	class:disabled
>
	{#if label}
		<label class="input-label" for="brutalist-input">
			{label}
			{#if required}
				<span class="required">*</span>
			{/if}
		</label>
	{/if}

	<div class="input-wrapper" class:focused class:has-icon={Icon}>
		{#if Icon}
			<span class="input-icon">
				<Icon />
			</span>
		{/if}

		{#if isMultiline}
			<textarea
				bind:this={inputElement}
				bind:value
				{placeholder}
				{disabled}
				{required}
				{rows}
				id="brutalist-input"
				class="brutalist-input"
				onfocus={() => (focused = true)}
				onblur={() => (focused = false)}
			></textarea>
		{:else}
			<input
				bind:this={inputElement}
				bind:value
				{type}
				{placeholder}
				{disabled}
				{required}
				id="brutalist-input"
				class="brutalist-input"
				onfocus={() => (focused = true)}
				onblur={() => (focused = false)}
			/>
		{/if}
	</div>

	{#if error}
		<div class="input-error">{error}</div>
	{/if}
</div>

<style>
	.brutalist-input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: auto;
	}

	.brutalist-input-group.full-width {
		width: 100%;
	}

	.input-label {
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

	.input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-brutalist-small);
		transform: rotate(-0.3deg);
	}

	.input-wrapper:hover {
		transform: translate(-1px, -1px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.input-wrapper.focused {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: var(--shadow-brutalist-large);
		border-color: var(--color-primary);
		background: var(--color-background-cream);
	}

	.input-wrapper.has-error {
		border-color: var(--color-danger);
		background: var(--color-background-light-pink);
	}

	.brutalist-input-group.disabled .input-wrapper {
		background: var(--color-background-disabled);
		opacity: 0.6;
		cursor: not-allowed;
		transform: rotate(-0.3deg);
	}

	.brutalist-input-group.disabled .input-wrapper:hover {
		transform: rotate(-0.3deg);
		box-shadow: var(--shadow-brutalist-small);
	}

	.input-icon {
		padding: 0 1rem;
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-secondary);
		pointer-events: none;
	}

	.input-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.brutalist-input {
		flex: 1;
		padding: 0.875rem 1rem;
		border: none;
		background: transparent;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-text-primary);
		font-family: var(--font-family-primary);
		outline: none;
		min-height: 0;
		resize: vertical;
	}

	.input-wrapper.has-icon .brutalist-input {
		padding-left: 0;
	}

	.brutalist-input::placeholder {
		color: var(--color-text-disabled);
		font-weight: 400;
	}

	.brutalist-input:disabled {
		cursor: not-allowed;
		color: var(--color-text-disabled);
	}

	textarea.brutalist-input {
		min-height: 80px;
		resize: vertical;
		font-family: var(--font-family-primary);
	}

	.input-error {
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

	@media (max-width: 600px) {
		.brutalist-input {
			font-size: 0.9375rem;
			padding: 0.75rem;
		}
	}
</style>
