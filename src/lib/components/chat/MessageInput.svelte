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
	{#if isGenerating && onStop}
		<button onclick={onStop} class="stop-btn">
			<span class="stop-icon">■</span>
			STOP GENERATION
		</button>
	{/if}

	<div class="message-input" class:is-disabled={isGenerating}>
		<textarea
			bind:this={inputElement}
			bind:value
			{placeholder}
			rows="1"
			disabled={isGenerating}
			use:focusAfterMount
			onkeydown={handleKeyDown}
		></textarea>
		<button
			onclick={onSend}
			disabled={isGenerating || !value.trim()}
			class="send-btn"
			aria-label="Send message"
		>
			<span class="send-text">SEND</span>
			<svg
				viewBox="0 0 24 24"
				width="24"
				height="24"
				stroke="currentColor"
				stroke-width="3"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="22" y1="2" x2="11" y2="13"></line>
				<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
			</svg>
		</button>
	</div>

	<div class="disclaimer">
		<span class="disclaimer-icon">⚡</span>
		Wllama is running locally in your browser. Model responses may not always be accurate.
	</div>
</div>

<style>
	.input-area {
		padding: 1.5rem;
		background: linear-gradient(135deg, #98FB98 0%, #87CEEB 100%);
		border-top: 4px solid #000;
		position: relative;
		overflow: hidden;
	}

	.input-area::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: repeating-linear-gradient(
			90deg,
			#000,
			#000 10px,
			#FFD93D 10px,
			#FFD93D 20px
		);
	}

	.message-input {
		display: flex;
		align-items: flex-end;
		background: #FFF;
		border: 4px solid #000;
		padding: 0;
		box-shadow: 6px 6px 0 #000;
		position: relative;
		transition: all 0.15s;
		margin-bottom: 1rem;
		border-radius: 0;
		overflow: hidden;
		transform: rotate(-0.5deg);
	}

	.message-input:hover:not(.is-disabled) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 8px 8px 0 #000;
	}

	.message-input.is-disabled {
		background: #E0E0E0;
		opacity: 0.7;
		transform: rotate(0deg);
		box-shadow: 4px 4px 0 #666;
	}

	.message-input.is-disabled textarea {
		color: #666;
		cursor: not-allowed;
	}

	textarea {
		flex-grow: 1;
		padding: 1rem 1.25rem;
		border: none;
		resize: none;
		font-family: 'Space Grotesk', monospace;
		font-size: 1.125rem;
		font-weight: 500;
		line-height: 1.4;
		background: transparent;
		min-height: 24px;
		max-height: 120px;
		outline: none;
		width: calc(100% - 100px);
		transition: color 0.2s;
		overflow: hidden;
		color: #000;
	}

	textarea::placeholder {
		color: #999;
		font-weight: 400;
	}

	.send-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-width: 100px;
		padding: 1rem 1.5rem;
		background: #FFD93D;
		color: #000;
		border: none;
		border-left: 4px solid #000;
		cursor: pointer;
		transition: all 0.15s;
		font-family: 'Space Grotesk', monospace;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.send-btn:hover:not(:disabled) {
		background: #FF69B4;
	}

	.send-btn svg {
		width: 20px;
		height: 20px;
	}

	.send-btn:disabled {
		background: #CCC;
		cursor: not-allowed;
		opacity: 0.5;
	}

	.send-text {
		font-size: 0.875rem;
	}

	.stop-btn {
		padding: 1rem 1.5rem;
		background: #FF6B6B;
		color: #000;
		border: 4px solid #000;
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin: 0 auto 1.25rem;
		transition: all 0.15s;
		box-shadow: 6px 6px 0 #000;
		font-family: 'Space Grotesk', monospace;
		text-transform: uppercase;
		letter-spacing: 1px;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	.stop-icon {
		font-size: 1.5rem;
	}

	.stop-btn:hover {
		transform: translate(-3px, -3px);
		box-shadow: 9px 9px 0 #000;
		animation: none;
	}

	.disclaimer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: #000;
		text-align: center;
		background: #FFD93D;
		padding: 0.625rem 1rem;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		transform: rotate(-1deg);
		margin: 0 auto;
		width: fit-content;
	}

	.disclaimer-icon {
		font-size: 1.25rem;
		animation: flash 2s ease-in-out infinite;
	}

	@keyframes flash {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.input-area.disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	@media (max-width: 600px) {
		.send-btn {
			min-width: 80px;
			padding: 1rem;
		}

		.send-text {
			display: none;
		}

		textarea {
			font-size: 1rem;
			width: calc(100% - 80px);
		}

		.disclaimer {
			font-size: 0.8125rem;
			padding: 0.5rem 0.75rem;
		}
	}
</style>
