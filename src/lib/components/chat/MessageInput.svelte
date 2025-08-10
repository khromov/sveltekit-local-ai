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
	<div class="message-input" class:is-disabled={isGenerating}>
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
			<button onclick={onStop} class="action-btn stop-btn" aria-label="Stop generation">
				<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
					<rect x="6" y="6" width="12" height="12" rx="2" />
				</svg>
			</button>
		{:else}
			<button
				onclick={onSend}
				disabled={isGenerating || !value.trim()}
				class="action-btn send-btn"
				aria-label="Send message"
			>
				<svg
					viewBox="0 0 24 24"
					width="20"
					height="20"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M22 2L11 13" />
					<path d="M22 2L15 22L11 13L2 9L22 2Z" />
				</svg>
			</button>
		{/if}
	</div>

	<div class="input-hints">
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="opacity: 0.5;">
			<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1" />
			<path d="M8 11V8M8 5V5.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
		</svg>
		<span>AI responses are generated locally • May not always be accurate</span>
	</div>
</div>

<style>
	.input-area {
		padding: 1.5rem;
		background: linear-gradient(180deg, transparent 0%, rgba(250, 248, 243, 0.5) 100%);
		border-top: 1px solid rgba(139, 111, 71, 0.15);
		position: relative;
	}

	.message-input {
		display: flex;
		align-items: flex-end;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(139, 111, 71, 0.2);
		padding: 0;
		border-radius: 16px;
		overflow: hidden;
		transition: all 0.3s ease;
		margin-bottom: 0.75rem;
		backdrop-filter: blur(10px);
		box-shadow:
			0 2px 12px rgba(46, 90, 61, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.message-input:focus-within {
		border-color: rgba(46, 90, 61, 0.3);
		box-shadow:
			0 4px 20px rgba(46, 90, 61, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
		background: rgba(255, 255, 255, 0.95);
	}

	.message-input.is-disabled {
		opacity: 0.7;
		background: rgba(240, 240, 240, 0.8);
	}

	textarea {
		flex-grow: 1;
		padding: 1rem 1.25rem;
		border: none;
		resize: none;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		font-size: 0.975rem;
		font-weight: 400;
		line-height: 1.5;
		background: transparent;
		min-height: 24px;
		max-height: 120px;
		outline: none;
		color: var(--text-primary);
		letter-spacing: 0.01em;
	}

	textarea::placeholder {
		color: var(--text-muted);
		font-weight: 400;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		margin: 8px;
		align-self: center;
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow:
			0 2px 8px rgba(45, 90, 61, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.action-btn:hover:not(:disabled) {
		transform: scale(1.1);
		box-shadow:
			0 4px 12px rgba(45, 90, 61, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
	}

	.action-btn:active:not(:disabled) {
		transform: scale(0.95);
		box-shadow:
			0 1px 4px rgba(45, 90, 61, 0.15),
			inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.action-btn:disabled {
		background: linear-gradient(135deg, var(--earth-stone) 0%, var(--text-muted) 100%);
		cursor: not-allowed;
		opacity: 0.5;
	}

	.stop-btn {
		background: linear-gradient(135deg, var(--earth-clay) 0%, var(--earth-soil) 100%);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	.input-hints {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		color: var(--text-muted);
		text-align: center;
		padding: 0.5rem;
		background: rgba(168, 185, 159, 0.08);
		border: 1px solid rgba(139, 111, 71, 0.1);
		border-radius: 8px;
		letter-spacing: 0.02em;
		margin: 0 auto;
		width: fit-content;
		max-width: 100%;
	}

	@media (max-width: 600px) {
		.input-area {
			padding: 1rem;
		}

		textarea {
			font-size: 0.9375rem;
			padding: 0.875rem 1rem;
		}

		.action-btn {
			width: 36px;
			height: 36px;
		}

		.input-hints {
			font-size: 0.75rem;
			width: 100%;
			padding: 0.375rem 0.5rem;
		}
	}
</style>
