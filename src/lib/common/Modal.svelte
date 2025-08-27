<script lang="ts">
	import type { Snippet } from 'svelte';
	import XIcon from 'virtual:icons/lucide/x';

	interface Props {
		children?: Snippet;
		title?: string;
		visible?: boolean;
		size?: 'small' | 'medium' | 'large' | 'full';
		closable?: boolean;
		backdrop?: 'blur' | 'dark' | 'none';
		onClose?: () => void;
	}

	let {
		children,
		title = '',
		visible = $bindable(false),
		size = 'medium',
		closable = true,
		backdrop = 'blur',
		onClose
	}: Props = $props();

	let modalElement: HTMLElement | undefined = $state();

	function handleClose() {
		visible = false;
		onClose?.();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (closable && event.target === event.currentTarget) {
			handleClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && closable) {
			handleClose();
		}
	}

	const sizeMap = {
		small: 'max-width: 400px;',
		medium: 'max-width: 600px;',
		large: 'max-width: 800px;',
		full: 'width: 95vw; height: 95vh; max-width: none; max-height: none;'
	};

	$effect(() => {
		if (visible) {
			document.body.style.overflow = 'hidden';
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.body.style.overflow = '';
			document.removeEventListener('keydown', handleKeydown);
		}

		return () => {
			document.body.style.overflow = '';
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if visible}
	<div
		class="modal-overlay"
		class:backdrop-blur={backdrop === 'blur'}
		class:backdrop-dark={backdrop === 'dark'}
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
	>
		<div
			bind:this={modalElement}
			class="brutalist-modal"
			style={sizeMap[size]}
			onclick={(e) => e.stopPropagation()}
		>
			<div class="modal-decoration"></div>

			{#if title || closable}
				<div class="modal-header">
					{#if title}
						<h2 id="modal-title" class="modal-title">{title}</h2>
					{/if}

					{#if closable}
						<button class="close-btn" onclick={handleClose} type="button" aria-label="Close modal">
							<XIcon />
						</button>
					{/if}
				</div>
			{/if}

			<div class="modal-body">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		animation: overlayFadeIn 0.3s ease-out;
	}

	.modal-overlay.backdrop-blur {
		backdrop-filter: blur(4px);
		background: rgba(0, 0, 0, 0.3);
	}

	.modal-overlay.backdrop-dark {
		background: rgba(0, 0, 0, 0.6);
	}

	@keyframes overlayFadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.brutalist-modal {
		position: relative;
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
		border-radius: 12px;
		box-shadow: var(--shadow-brutalist-xlarge);
		max-height: 90vh;
		width: 100%;
		overflow: hidden;
		transform: rotate(-0.5deg);
		animation: modalSlideIn 0.3s ease-out;
	}

	@keyframes modalSlideIn {
		from {
			transform: translateY(-50px) rotate(-0.5deg) scale(0.9);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(-0.5deg) scale(1);
			opacity: 1;
		}
	}

	.modal-decoration {
		position: absolute;
		top: -10px;
		left: -10px;
		width: 60px;
		height: 60px;
		background: var(--color-accent-pink);
		border: var(--border-brutalist-thick);
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		opacity: 0.3;
		z-index: 0;
		animation: decorationFloat 6s ease-in-out infinite;
	}

	@keyframes decorationFloat {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-10px) rotate(180deg);
		}
	}

	.modal-header {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 1.5rem 0;
		gap: 1rem;
	}

	.modal-title {
		margin: 0;
		font-family: var(--font-family-display);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
		background: var(--color-primary);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(1deg);
		width: fit-content;
	}

	.close-btn {
		background: var(--color-background-secondary);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		color: var(--color-text-primary);
		cursor: pointer;
		padding: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-brutalist-small);
		flex-shrink: 0;
	}

	.close-btn :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.close-btn:hover {
		background: var(--color-danger);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.close-btn:active {
		transform: translate(0);
		box-shadow: var(--shadow-brutalist-small);
	}

	.modal-body {
		position: relative;
		z-index: 1;
		padding: 1.5rem;
		overflow-y: auto;
		max-height: calc(90vh - 100px);
	}

	.modal-body::-webkit-scrollbar {
		width: 8px;
	}

	.modal-body::-webkit-scrollbar-track {
		background: var(--color-background-tertiary);
	}

	.modal-body::-webkit-scrollbar-thumb {
		background: var(--color-text-primary);
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.modal-overlay {
			padding: 0.5rem;
		}

		.brutalist-modal {
			max-height: 95vh;
		}

		.modal-header {
			padding: 1rem 1rem 0;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.modal-title {
			font-size: 1.5rem;
		}

		.modal-body {
			padding: 1rem;
			max-height: calc(95vh - 120px);
		}

		.close-btn {
			padding: 0.625rem;
			align-self: flex-end;
		}
	}

	@media (max-width: 600px) {
		.modal-header {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.modal-title {
			font-size: 1.25rem;
			padding: 0.375rem 0.75rem;
		}
	}
</style>
