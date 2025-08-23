<!-- Shared Result Display Component -->
<script lang="ts">
	import CheckCircleIcon from 'virtual:icons/lucide/check-circle';
	import ClipboardIcon from 'virtual:icons/lucide/clipboard';
	import CheckIcon from 'virtual:icons/lucide/check';
	import DownloadIcon from 'virtual:icons/lucide/download';
	import RotateCwIcon from 'virtual:icons/lucide/rotate-cw';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		icon?: any;
		hasActions?: boolean;
		onCopy?: () => void;
		onDownload?: () => void;
		onProcessAnother?: () => void;
		copied?: boolean;
		children: Snippet;
		tabOptions?: { id: string; label: string }[];
		activeTab?: string;
		onTabChange?: (tab: string) => void;
	}

	let {
		title = 'Result',
		icon: Icon = CheckCircleIcon,
		hasActions = true,
		onCopy,
		onDownload,
		onProcessAnother,
		copied = false,
		children,
		tabOptions,
		activeTab,
		onTabChange
	}: Props = $props();
</script>

<div class="result-display-wrapper">
	<div class="result-display">
		<div class="result-decoration"></div>
		<div class="result-content">
			<div class="result-header">
				<h3>
					<span class="header-icon"><Icon /></span>
					{title}
				</h3>

				{#if hasActions}
					<div class="result-actions">
						{#if tabOptions && tabOptions.length > 0}
							<div class="tab-selectors">
								{#each tabOptions as tab (tab.id)}
									<button class:active={activeTab === tab.id} onclick={() => onTabChange?.(tab.id)}>
										{tab.label}
									</button>
								{/each}
							</div>
						{/if}

						{#if onCopy}
							<button class="action-btn copy-btn" onclick={onCopy} class:copied>
								{#if copied}
									<span class="btn-icon"><CheckIcon /></span>
									Copied!
								{:else}
									<span class="btn-icon"><ClipboardIcon /></span>
									Copy
								{/if}
							</button>
						{/if}

						{#if onDownload}
							<button class="action-btn download-btn" onclick={onDownload}>
								<span class="btn-icon"><DownloadIcon /></span>
								Download
							</button>
						{/if}

						{#if onProcessAnother}
							<button class="action-btn process-another-btn" onclick={onProcessAnother}>
								<span class="btn-icon"><RotateCwIcon /></span>
								Process Another
							</button>
						{/if}
					</div>
				{/if}
			</div>

			<div class="result-body">
				{@render children()}
			</div>
		</div>
	</div>
</div>

<style>
	.result-display-wrapper {
		display: flex;
		margin: 1.5rem 0;
		width: 100%;
		animation: resultSlide 0.5s ease-out;
	}

	@keyframes resultSlide {
		from {
			transform: translateY(20px) rotate(-1deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(0.5deg);
			opacity: 1;
		}
	}

	.result-display {
		position: relative;
		width: 100%;
		max-width: 100%;
		transform: rotate(0.5deg);
	}

	.result-decoration {
		position: absolute;
		top: -10px;
		left: -10px;
		right: -10px;
		bottom: -10px;
		background: linear-gradient(135deg, var(--color-success) 0%, var(--color-accent-blue) 100%);
		z-index: -1;
		opacity: 0.3;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		transform: rotate(-1deg);
	}

	.result-content {
		padding: 2rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
		box-shadow: var(--shadow-brutalist-xlarge);
		position: relative;
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: var(--border-brutalist-thick);
	}

	.result-content h3 {
		margin: 0;
		font-family: var(--font-family-display);
		font-size: 1.75rem;
		color: var(--color-text-primary);
		letter-spacing: 2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--color-success);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(-1deg);
		text-transform: uppercase;
	}

	.header-icon {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		animation: sparkle 2s ease-in-out infinite;
	}

	.header-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	@keyframes sparkle {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
		}
		50% {
			transform: scale(1.2) rotate(180deg);
		}
	}

	.result-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* Tab selectors */
	.tab-selectors {
		display: flex;
		border: var(--border-brutalist-thick);
		background: var(--color-background-main);
		box-shadow: var(--shadow-brutalist-medium);
		overflow: hidden;
	}

	.tab-selectors button {
		padding: 0.625rem 1rem;
		background: var(--color-background-main);
		border: none;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-primary);
		transition: all 0.15s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: var(--font-family-primary);
	}

	.tab-selectors button:not(:last-child) {
		border-right: var(--border-brutalist-thick);
	}

	.tab-selectors button:hover:not(.active) {
		background: var(--color-background-cream);
	}

	.tab-selectors button.active {
		background: var(--color-primary-dark);
	}

	/* Action buttons */
	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		border: var(--border-brutalist-thick);
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.15s ease;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-family: var(--font-family-primary);
		border-radius: 6px;
	}

	.copy-btn {
		background: var(--color-accent-pink);
		color: var(--color-text-primary);
	}

	.download-btn {
		background: var(--color-success);
		color: var(--color-text-primary);
	}

	.process-another-btn {
		background: var(--color-primary-dark);
		color: var(--color-text-primary);
	}

	.action-btn:hover {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.copy-btn:hover {
		background: var(--color-primary-dark);
	}

	.download-btn:hover {
		background: var(--color-success-hover);
	}

	.process-another-btn:hover {
		background: var(--color-warning);
	}

	.copy-btn.copied {
		background: var(--color-success);
		animation: copySuccess 0.3s ease-out;
	}

	@keyframes copySuccess {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	.btn-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.btn-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	.result-body {
		background: linear-gradient(
			135deg,
			rgba(255, 217, 61, 0.05) 0%,
			rgba(152, 251, 152, 0.05) 100%
		);
		border: var(--border-brutalist-thick);
		padding: 1.5rem;
		box-shadow: inset 3px 3px 0 rgba(0, 0, 0, 0.1);
		min-height: 100px;
		max-height: 400px;
		overflow-y: auto;
		border-radius: 8px;
	}

	/* Custom scrollbar */
	.result-body::-webkit-scrollbar {
		width: 12px;
	}

	.result-body::-webkit-scrollbar-track {
		background: var(--color-background-main);
		border-left: var(--border-brutalist-thick);
	}

	.result-body::-webkit-scrollbar-thumb {
		background: var(--color-primary-dark);
		border: var(--border-brutalist-thin);
	}

	.result-body::-webkit-scrollbar-thumb:hover {
		background: var(--color-accent-pink);
	}

	@media (max-width: 768px) {
		.result-content {
			padding: 1.5rem;
		}

		.result-header {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.result-actions {
			flex-direction: column;
			width: 100%;
		}

		.tab-selectors {
			width: 100%;
		}

		.tab-selectors button {
			flex: 1;
		}

		.action-btn {
			width: 100%;
			justify-content: center;
		}
	}

	@media (max-width: 600px) {
		.result-content {
			padding: 1.25rem;
		}

		.result-content h3 {
			font-size: 1.5rem;
		}

		.result-body {
			padding: 1rem;
		}
	}
</style>
