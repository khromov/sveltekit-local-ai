<script lang="ts">
	interface Props {
		text?: string;
	}

	let { text = 'OR' }: Props = $props();
</script>

<div class="or-divider">
	<span>{text}</span>
</div>

<style>
	.or-divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0.5rem 0;
		position: relative;
	}

	.or-divider span {
		background: var(--color-background-main);
		padding: 0 1rem;
		font-weight: 700;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: var(--color-text-tertiary);
		position: relative;
		z-index: 1;
	}

	.or-divider::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-gray-300);
		top: 50%;
		transform: translateY(-50%);
		z-index: 0;
	}
</style>
