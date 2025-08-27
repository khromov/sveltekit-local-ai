<script lang="ts">
	interface Props {
		size?: 'small' | 'medium' | 'large' | 'xlarge';
		variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
		text?: string;
		centered?: boolean;
	}

	let { size = 'medium', variant = 'default', text = '', centered = false }: Props = $props();

	const sizeMap = {
		small: '1rem',
		medium: '1.5rem',
		large: '2rem',
		xlarge: '3rem'
	};

	const variantColors = {
		default: 'var(--color-text-primary)',
		primary: 'var(--color-primary)',
		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		danger: 'var(--color-danger)'
	};
</script>

<div class="spinner-wrapper" class:centered>
	<div
		class="brutalist-spinner"
		style="width: {sizeMap[size]}; height: {sizeMap[size]}; color: {variantColors[variant]};"
		role="status"
		aria-label={text || 'Loading'}
	>
		<svg
			width="100%"
			height="100%"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
				<!-- Rotating lines with different opacities for spinner effect -->
				<line class="line-1" x1="12" y1="2" x2="12" y2="6" />
				<line class="line-2" x1="12" y1="18" x2="12" y2="22" />
				<line class="line-3" x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
				<line class="line-4" x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
				<line class="line-5" x1="2" y1="12" x2="6" y2="12" />
				<line class="line-6" x1="18" y1="12" x2="22" y2="12" />
				<line class="line-7" x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
				<line class="line-8" x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
			</g>
		</svg>

		<!-- Alternative brutalist spinner using squares -->
		<div class="square-spinner" style="width: {sizeMap[size]}; height: {sizeMap[size]};">
			<div class="square square-1"></div>
			<div class="square square-2"></div>
			<div class="square square-3"></div>
			<div class="square square-4"></div>
		</div>
	</div>

	{#if text}
		<div class="spinner-text">{text}</div>
	{/if}
</div>

<style>
	.spinner-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.spinner-wrapper.centered {
		justify-content: center;
		min-height: 100px;
	}

	.brutalist-spinner {
		position: relative;
		display: inline-block;
		animation: brutalistSpin 1.2s linear infinite;
	}

	.brutalist-spinner svg {
		display: block;
		transform: rotate(-90deg);
		animation: spinLines 1s ease-in-out infinite;
	}

	/* Hide the square spinner by default, show via CSS class if desired */
	.square-spinner {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		transform: rotate(45deg);
	}

	.brutalist-spinner.squares svg {
		display: none;
	}

	.brutalist-spinner.squares .square-spinner {
		display: block;
	}

	@keyframes brutalistSpin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes spinLines {
		0% {
			transform: rotate(-90deg) scale(1);
		}
		50% {
			transform: rotate(-90deg) scale(1.1);
		}
		100% {
			transform: rotate(-90deg) scale(1);
		}
	}

	/* Individual line animations with different delays */
	.line-1 {
		opacity: 1;
		animation: fade 1s ease-in-out infinite;
		animation-delay: 0s;
	}
	.line-2 {
		opacity: 0.3;
		animation: fade 1s ease-in-out infinite;
		animation-delay: 0.5s;
	}
	.line-3 {
		opacity: 0.9;
		animation: fade 1s ease-in-out infinite;
		animation-delay: 0.125s;
	}
	.line-4 {
		opacity: 0.2;
		animation: fade 1s ease-in-out infinite;
		animation-delay: 0.625s;
	}
	.line-5 {
		opacity: 0.8;
		animation: fade 1s ease-in-out infinite;
		animation-delay: 0.25s;
	}
	.line-6 {
		opacity: 0.1;
		animation: fade 1s ease-in-out infinite;
		animation-delay: 0.75s;
	}
	.line-7 {
		opacity: 0.7;
		animation: fade 1s ease-in-out infinite;
		animation-delay: 0.375s;
	}
	.line-8 {
		opacity: 0.4;
		animation: fade 1s ease-in-out infinite;
		animation-delay: 0.875s;
	}

	@keyframes fade {
		0%,
		100% {
			opacity: 0.2;
		}
		50% {
			opacity: 1;
		}
	}

	/* Square spinner styles */
	.square {
		position: absolute;
		width: 25%;
		height: 25%;
		background: currentColor;
		border: 1px solid currentColor;
		animation: squareBounce 1.2s infinite ease-in-out;
	}

	.square-1 {
		top: 0;
		left: 0;
		animation-delay: 0s;
	}

	.square-2 {
		top: 0;
		right: 0;
		animation-delay: 0.3s;
	}

	.square-3 {
		bottom: 0;
		right: 0;
		animation-delay: 0.6s;
	}

	.square-4 {
		bottom: 0;
		left: 0;
		animation-delay: 0.9s;
	}

	@keyframes squareBounce {
		0%,
		70%,
		100% {
			transform: scale(1);
			opacity: 0.7;
		}
		35% {
			transform: scale(1.3);
			opacity: 1;
		}
	}

	.spinner-text {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
		text-align: center;
		background: var(--color-background-tertiary);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		box-shadow: var(--shadow-brutalist-small);
		animation: textPulse 2s ease-in-out infinite;
	}

	@keyframes textPulse {
		0%,
		100% {
			opacity: 0.8;
		}
		50% {
			opacity: 1;
			transform: scale(1.02);
		}
	}

	@media (max-width: 600px) {
		.spinner-text {
			font-size: 0.75rem;
			padding: 0.375rem 0.75rem;
		}
	}
</style>
