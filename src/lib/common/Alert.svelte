<script lang="ts">
	import type { Snippet } from 'svelte';
	import XIcon from 'virtual:icons/lucide/x';
	import InfoIcon from 'virtual:icons/lucide/info';
	import CheckCircleIcon from 'virtual:icons/lucide/check-circle';
	import AlertTriangleIcon from 'virtual:icons/lucide/alert-triangle';
	import XCircleIcon from 'virtual:icons/lucide/x-circle';

	interface Props {
		children?: Snippet;
		variant?: 'info' | 'success' | 'warning' | 'danger';
		title?: string;
		dismissible?: boolean;
		visible?: boolean;
		Icon?: any;
		onDismiss?: () => void;
	}

	let {
		children,
		variant = 'info',
		title = '',
		dismissible = false,
		visible = $bindable(true),
		Icon,
		onDismiss
	}: Props = $props();

	const variantConfig = {
		info: {
			bg: 'var(--color-accent-light-blue)',
			border: 'var(--color-accent-blue)',
			icon: InfoIcon
		},
		success: {
			bg: 'var(--color-accent-light-green)',
			border: 'var(--color-success)',
			icon: CheckCircleIcon
		},
		warning: {
			bg: 'var(--color-accent-light-yellow)',
			border: 'var(--color-warning)',
			icon: AlertTriangleIcon
		},
		danger: {
			bg: 'var(--color-background-light-pink)',
			border: 'var(--color-danger)',
			icon: XCircleIcon
		}
	};

	const config = variantConfig[variant];
	const AlertIcon = Icon || config.icon;

	function handleDismiss() {
		visible = false;
		onDismiss?.();
	}
</script>

{#if visible}
	<div
		class="brutalist-alert"
		style="background: {config.bg}; border-color: {config.border};"
		role="alert"
	>
		<div class="alert-decoration"></div>

		<div class="alert-content">
			<div class="alert-header">
				<div class="alert-icon">
					<AlertIcon />
				</div>

				<div class="alert-text">
					{#if title}
						<div class="alert-title">{title}</div>
					{/if}

					{#if children}
						<div class="alert-message">
							{@render children()}
						</div>
					{/if}
				</div>
			</div>

			{#if dismissible}
				<button
					class="dismiss-btn"
					onclick={handleDismiss}
					type="button"
					aria-label="Dismiss alert"
				>
					<XIcon />
				</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	.brutalist-alert {
		position: relative;
		background: var(--color-accent-light-blue);
		border: var(--border-brutalist-thick);
		border-radius: 12px;
		padding: 1.25rem;
		box-shadow: var(--shadow-brutalist-large);
		transform: rotate(-0.5deg);
		animation: alertSlide 0.3s ease-out;
		overflow: hidden;
	}

	@keyframes alertSlide {
		from {
			transform: translateY(-20px) rotate(-0.5deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(-0.5deg);
			opacity: 1;
		}
	}

	.alert-decoration {
		position: absolute;
		top: -6px;
		right: -6px;
		width: 30px;
		height: 30px;
		background: currentColor;
		opacity: 0.2;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		animation: float 4s ease-in-out infinite;
		z-index: 0;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-3px) rotate(180deg);
		}
	}

	.alert-content {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.alert-header {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		flex: 1;
	}

	.alert-icon {
		font-size: 1.5rem;
		color: var(--color-text-primary);
		display: flex;
		align-items: center;
		flex-shrink: 0;
		margin-top: 0.125rem;
	}

	.alert-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.alert-text {
		flex: 1;
		min-width: 0;
	}

	.alert-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
	}

	.alert-message {
		font-size: 1rem;
		color: var(--color-text-primary);
		font-weight: 500;
		line-height: 1.5;
	}

	.dismiss-btn {
		background: none;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		color: var(--color-text-primary);
		cursor: pointer;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-brutalist-small);
		flex-shrink: 0;
		background: rgba(255, 255, 255, 0.5);
	}

	.dismiss-btn :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.dismiss-btn:hover {
		background: rgba(0, 0, 0, 0.1);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.dismiss-btn:active {
		transform: translate(0);
		box-shadow: var(--shadow-brutalist-small);
	}

	@media (max-width: 600px) {
		.brutalist-alert {
			padding: 1rem;
		}

		.alert-content {
			gap: 0.75rem;
		}

		.alert-header {
			gap: 0.5rem;
		}

		.alert-icon {
			font-size: 1.25rem;
			margin-top: 0.25rem;
		}

		.alert-icon :global(svg) {
			width: 1.25rem;
			height: 1.25rem;
		}

		.alert-title {
			font-size: 1rem;
		}

		.alert-message {
			font-size: 0.9375rem;
		}
	}
</style>
