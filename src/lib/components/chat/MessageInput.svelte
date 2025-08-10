<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		value: string;
		isGenerating?: boolean;
		onSend: () => void;
		onStop?: () => void;
		placeholder?: string;
	}

	let {
		value = $bindable(),
		isGenerating = false,
		onSend,
		onStop,
		placeholder = 'Type your message...'
	}: Props = $props();

	let inputElement: HTMLTextAreaElement | undefined = $state();

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (!isGenerating && value.trim()) {
				onSend();
			}
		}
	}

	function focusAfterMount(node: HTMLTextAreaElement) {
		if (node && !node.disabled) {
			node.focus();
		}
	}

	export function focus() {
		if (inputElement) {
			inputElement.focus();
		}
	}

	onMount(() => {
		focus();
	});
</script>

<div class="input-area">
	<div class="input-decoration"></div>

	<div class="message-input" class:is-disabled={isGenerating}>
		<span class="input-emoji">💭</span>
		<textarea
			id="chat"
			bind:this={inputElement}
			bind:value
			{placeholder}
			rows="1"
			use:focusAfterMount
			onkeydown={handleKeyDown}
		></textarea>
		{#if isGenerating && onStop}
			<button onclick={onStop} class="stop-btn-inline" aria-label="Stop generation">
				<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
					<rect x="4" y="4" width="16" height="16" />
				</svg>
			</button>
		{:else}
			<button
				onclick={onSend}
				disabled={isGenerating || !value.trim()}
				class="send-btn"
				aria-label="Send message"
			>
				<svg
					viewBox="0 0 24 24"
					width="20"
					height="20"
					stroke="currentColor"
					stroke-width="2.5"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="22" y1="2" x2="11" y2="13"></line>
					<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
				</svg>
			</button>
		{/if}
	</div>

	<div class="disclaimer">
		<span class="disclaimer-icon">💡</span>
		Model responses may not always be accurate.
	</div>
</div>

<style>
	.input-area {
		padding: 1.5rem;
		background: rgba(247, 249, 247, 0.95);
		border-top: 1px solid rgba(82, 121, 82, 0.2);
		position: relative;
		overflow: hidden;
		backdrop-filter: blur(16px);
	}

	.input-decoration {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			rgba(82, 121, 82, 0.3) 0%,
			rgba(107, 142, 107, 0.2) 50%,
			rgba(82, 121, 82, 0.3) 100%
		);
		animation: gentle-shimmer 4s linear infinite;
	}

	@keyframes gentle-shimmer {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(100%);
		}
	}

	.message-input {
		display: flex;
		align-items: flex-end;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(82, 121, 82, 0.2);
		padding: 0;
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.15);
		border-radius: 20px;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		margin-bottom: 1rem;
		position: relative;
		backdrop-filter: blur(12px);
	}

	.input-emoji {
		position: absolute;
		top: -12px;
		left: 16px;
		font-size: 1.25rem;
		z-index: 1;
		background: rgba(255, 255, 255, 0.95);
		padding: 0.25rem 0.75rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 12px;
		animation: gentle-emoji-bounce 4s ease-in-out infinite;
		backdrop-filter: blur(8px);
		filter: drop-shadow(0 2px 4px rgba(82, 121, 82, 0.2));
	}

	@keyframes gentle-emoji-bounce {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-2px) scale(1.05);
		}
	}

	.message-input:hover:not(.is-disabled) {
		transform: translateY(-2px);
		box-shadow: 0 12px 48px rgba(82, 121, 82, 0.25);
		border-color: rgba(82, 121, 82, 0.3);
	}

	.message-input.is-disabled {
		background: rgba(240, 240, 240, 0.8);
		opacity: 0.6;
		filter: grayscale(30%);
	}

	textarea {
		flex-grow: 1;
		padding: 1rem 1.25rem;
		padding-top: 1.5rem;
		border: none;
		resize: none;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-size: 0.95rem;
		font-weight: 400;
		line-height: 1.5;
		background: transparent;
		min-height: 22px;
		max-height: 120px;
		outline: none;
		color: #2e4a2e;
	}

	textarea::placeholder {
		color: rgba(82, 121, 82, 0.5);
		font-weight: 400;
	}

	.send-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		margin: 8px;
		align-self: center;
		background: linear-gradient(135deg, #527952 0%, #6b8e6b 100%);
		color: #ffffff;
		border: 1px solid rgba(82, 121, 82, 0.3);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.2);
		position: relative;
		overflow: hidden;
	}

	.send-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #6b8e6b 0%, #7da47d 100%);
		transform: scale(1.05) translateY(-1px);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.3);
	}

	.send-btn:active:not(:disabled) {
		transform: scale(0.95);
		box-shadow: 0 2px 8px rgba(82, 121, 82, 0.2);
	}

	.send-btn:disabled {
		background: linear-gradient(135deg, #a0a0a0 0%, #b0b0b0 100%);
		cursor: not-allowed;
		opacity: 0.5;
		transform: none;
	}

	.stop-btn-inline {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		margin: 8px;
		align-self: center;
		background: linear-gradient(135deg, #c85a54 0%, #a04741 100%);
		color: #ffffff;
		border: 1px solid rgba(168, 71, 65, 0.3);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 16px rgba(200, 90, 84, 0.2);
		animation: gentle-pulse-stop 2s ease-in-out infinite;
	}

	@keyframes gentle-pulse-stop {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.02);
			opacity: 0.9;
		}
	}

	.stop-btn-inline:hover {
		background: linear-gradient(135deg, #d46a64 0%, #b55751 100%);
		transform: scale(1.05) translateY(-1px);
		box-shadow: 0 8px 32px rgba(200, 90, 84, 0.3);
		animation: none;
	}

	.stop-btn-inline:active {
		transform: scale(0.95);
		box-shadow: 0 2px 8px rgba(200, 90, 84, 0.2);
	}

	.disclaimer {
		font-size: 0.75rem;
		font-weight: 400;
		color: rgba(82, 121, 82, 0.6);
		text-align: center;
		background: rgba(255, 255, 255, 0.8);
		padding: 0.75rem 1rem;
		border: 1px solid rgba(82, 121, 82, 0.15);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 0 auto;
		width: fit-content;
		max-width: 300px;
		backdrop-filter: blur(8px);
		line-height: 1.4;
	}

	.disclaimer-icon {
		font-size: 1rem;
		filter: drop-shadow(0 1px 2px rgba(82, 121, 82, 0.2));
	}

	@media (max-width: 600px) {
		.input-area {
			padding: 1rem;
		}

		textarea {
			font-size: 0.9375rem;
			padding: 0.75rem;
			padding-top: 1.125rem;
		}

		.send-btn,
		.stop-btn-inline {
			width: 40px;
			height: 40px;
		}

		.disclaimer {
			font-size: 0.75rem;
			width: 100%;
		}

		.input-emoji {
			font-size: 1.25rem;
		}
	}
</style>
