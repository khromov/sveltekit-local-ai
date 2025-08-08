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
		placeholder = 'Message'
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
		<button onclick={onStop} class="stop-btn">Stop Generation</button>
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
				width="24"
				height="24"
				stroke="currentColor"
				stroke-width="2"
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
		padding: 1rem 1.25rem;
		border-top: 1px solid #e5e5e5;
		background-color: white;
	}

	.message-input {
		display: flex;
		align-items: flex-end;
		background-color: #f0f0f0;
		border-radius: 18px;
		padding: 0.625rem 1.125rem 0.625rem 0.875rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		position: relative;
		transition: background-color 0.2s;
		margin-bottom: 0.5rem;
	}

	.message-input.is-disabled {
		background-color: #dfdfdf;
	}

	.message-input.is-disabled textarea {
		color: #777;
		cursor: not-allowed;
	}

	textarea {
		flex-grow: 1;
		padding: 0.625rem;
		border: none;
		border-radius: 12px;
		resize: none;
		font-family: inherit;
		font-size: 1.0625rem;
		line-height: 1.4;
		background-color: transparent;
		min-height: 20px;
		max-height: 120px;
		outline: none;
		width: calc(100% - 50px);
		transition: color 0.2s;
		overflow: hidden;
	}

	.send-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		transition: background-color 0.2s;
		padding: 0;
		position: absolute;
		right: 8px;
		bottom: 8px;
	}

	.send-btn:hover {
		background-color: #0062cc;
	}

	.send-btn svg {
		width: 18px;
		height: 18px;
	}

	.send-btn:disabled {
		background-color: #b0b0b0;
		cursor: not-allowed;
	}

	.stop-btn {
		padding: 0.625rem 1rem;
		background-color: #ff3b30;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		display: block;
		margin: 0 auto 0.75rem;
		transition: background-color 0.2s;
	}

	.stop-btn:hover {
		background-color: #e0352b;
	}

	.disclaimer {
		margin-top: 0.375rem;
		font-size: 0.8125rem;
		color: #8e8e93;
		text-align: center;
	}

</style>
