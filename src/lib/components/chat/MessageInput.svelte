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

	{#if isGenerating && onStop}
		<button onclick={onStop} class="stop-btn">
			<span class="stop-icon">🛑</span>
			Stop Generation
		</button>
	{/if}

	<div class="message-input" class:is-disabled={isGenerating}>
		<span class="input-emoji">💭</span>
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
	</div>

	<div class="disclaimer">
		<span class="disclaimer-icon">�</span>
		Model responses may not always be accurate.
	</div>
</div>

<style>
	.input-area {
		padding: 1.25rem;
		background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
		border-top: 3px solid #000;
		position: relative;
		overflow: hidden;
	}

	.input-decoration {
		position: absolute;
		top: -2px;
		left: 0;
		right: 0;
		height: 3px;
		background: repeating-linear-gradient(90deg, #98fb98, #98fb98 8px, #ffd93d 8px, #ffd93d 16px);
		animation: slide 2s linear infinite;
	}

	@keyframes slide {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(16px);
		}
	}

	.message-input {
		display: flex;
		align-items: flex-end;
		background: #fff;
		border: 3px solid #000;
		padding: 0;
		box-shadow: 5px 5px 0 #000;
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.2s;
		margin-bottom: 0.75rem;
		transform: rotate(-0.5deg);
		position: relative;
	}

	.input-emoji {
		position: absolute;
		top: -10px;
		left: 10px;
		font-size: 1.5rem;
		z-index: 1;
		background: #98fb98;
		padding: 0 8px;
		border: 2px solid #000;
		border-radius: 4px;
		animation: bounce-emoji 3s ease-in-out infinite;
	}

	@keyframes bounce-emoji {
		0%,
		100% {
			transform: translateY(0) rotate(-5deg);
		}
		50% {
			transform: translateY(-3px) rotate(5deg);
		}
	}

	.message-input:hover:not(.is-disabled) {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 7px 7px 0 #000;
	}

	.message-input.is-disabled {
		background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
		opacity: 0.7;
	}

	textarea {
		flex-grow: 1;
		padding: 0.875rem 1rem;
		padding-top: 1.25rem;
		border: none;
		resize: none;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.4;
		background: transparent;
		min-height: 22px;
		max-height: 120px;
		outline: none;
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
		width: 44px;
		height: 44px;
		margin: 4px;
		background: linear-gradient(135deg, #ffd93d 0%, #ffa500 100%);
		color: #000;
		border: 2px solid #000;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 2px 2px 0 #000;
		transform: rotate(5deg);
	}

	.send-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #98fb98 0%, #90ee90 100%);
		transform: scale(1.1) rotate(0deg);
		box-shadow: 3px 3px 0 #000;
	}

	.send-btn:active:not(:disabled) {
		transform: scale(0.95);
		box-shadow: 1px 1px 0 #000;
	}

	.send-btn:disabled {
		background: #e0e0e0;
		cursor: not-allowed;
		opacity: 0.5;
		transform: rotate(0deg);
	}

	.stop-btn {
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
		color: #000;
		border: 3px solid #000;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 0 auto 1rem;
		transition: all 0.2s;
		box-shadow: 5px 5px 0 #000;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		transform: rotate(-1deg);
		animation: shake 0.5s ease-in-out infinite;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0) rotate(-1deg);
		}
		25% {
			transform: translateX(-2px) rotate(-1deg);
		}
		75% {
			transform: translateX(2px) rotate(-1deg);
		}
	}

	.stop-btn:hover {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 7px 7px 0 #000;
		animation: none;
	}

	.stop-icon {
		font-size: 1.125rem;
	}

	.disclaimer {
		font-size: 0.75rem;
		font-weight: 400;
		color: #666;
		text-align: center;
		background: #f8f8f8;
		padding: 0.5rem 0.75rem;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		margin: 0 auto;
		width: fit-content;
		max-width: 300px;
	}

	.disclaimer-icon {
		font-size: 0.875rem;
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

		.send-btn {
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
