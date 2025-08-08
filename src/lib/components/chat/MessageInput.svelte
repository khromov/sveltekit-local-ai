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
			Stop Generation
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
		Wllama is running locally in your browser. Model responses may not always be accurate.
	</div>
</div>

<style>
	.input-area {
		padding: 1.25rem;
		background: #F5F5F5;
		border-top: 3px solid #000;
	}

	.message-input {
		display: flex;
		align-items: flex-end;
		background: #FFF;
		border: 2px solid #000;
		padding: 0;
		box-shadow: 3px 3px 0 #000;
		border-radius: 8px;
		overflow: hidden;
		transition: all 0.2s;
		margin-bottom: 0.75rem;
	}

	.message-input:hover:not(.is-disabled) {
		box-shadow: 4px 4px 0 #000;
	}

	.message-input.is-disabled {
		background: #F0F0F0;
		opacity: 0.7;
	}

	textarea {
		flex-grow: 1;
		padding: 0.875rem 1rem;
		border: none;
		resize: none;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.4;
		background: transparent;
		min-height: 22px;
		max-height: 120px;
		outline: none;
		color: #000;
	}

	textarea::placeholder {
		color: #999;
	}

	.send-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		margin: 4px;
		background: #FFD700;
		color: #000;
		border: 2px solid #000;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.send-btn:hover:not(:disabled) {
		background: #FFA500;
		transform: scale(1.05);
	}

	.send-btn:disabled {
		background: #E0E0E0;
		cursor: not-allowed;
		opacity: 0.5;
	}

	.stop-btn {
		padding: 0.75rem 1.25rem;
		background: #FF6B6B;
		color: #000;
		border: 2px solid #000;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9375rem;
		font-weight: 600;
		display: block;
		margin: 0 auto 1rem;
		transition: all 0.2s;
		box-shadow: 3px 3px 0 #000;
		font-family: 'Space Grotesk', system-ui, sans-serif;
	}

	.stop-btn:hover {
		transform: translate(-1px, -1px);
		box-shadow: 4px 4px 0 #000;
	}

	.disclaimer {
		font-size: 0.8125rem;
		font-weight: 500;
		color: #666;
		text-align: center;
	}

	.input-area.disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	@media (max-width: 600px) {
		.input-area {
			padding: 1rem;
		}

		textarea {
			font-size: 0.9375rem;
			padding: 0.75rem;
		}

		.send-btn {
			width: 40px;
			height: 40px;
		}

		.disclaimer {
			font-size: 0.75rem;
		}
	}
</style>
