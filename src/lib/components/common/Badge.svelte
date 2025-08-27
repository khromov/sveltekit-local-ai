<script lang="ts">
	interface Props {
		variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
		size?: 'small' | 'medium' | 'large';
		children?: import('svelte').Snippet;
	}

	let { variant = 'default', size = 'medium', children }: Props = $props();

	const variantStyles = {
		default: 'var(--color-background-tertiary)',
		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		danger: 'var(--color-danger)',
		info: 'var(--color-accent-blue)'
	};

	const sizeStyles = {
		small: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
		medium: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
		large: { padding: '0.5rem 1rem', fontSize: '1rem' }
	};
</script>

<span
	class="badge badge-{variant} badge-{size}"
	style="background: {variantStyles[variant]}; padding: {sizeStyles[size]
		.padding}; font-size: {sizeStyles[size].fontSize};"
>
	{@render children?.()}
</span>

<style>
	.badge {
		display: inline-block;
		color: var(--color-text-primary);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		box-shadow: var(--shadow-brutalist-small);
		font-family: var(--font-family-primary);
	}
</style>
