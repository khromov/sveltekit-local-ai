<script lang="ts">
	import { onMount } from 'svelte';
	import MessageCircleIcon from 'virtual:icons/lucide/message-circle';
	import LightbulbIcon from 'virtual:icons/lucide/lightbulb';
	import SendIcon from 'virtual:icons/lucide/send';
	import SquareIcon from 'virtual:icons/lucide/square';

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
		<span class="input-emoji"><MessageCircleIcon /></span>
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
				<SquareIcon />
			</button>
		{:else}
			<button
				onclick={onSend}
				disabled={isGenerating || !value.trim()}
				class="send-btn"
				aria-label="Send message"
			>
				<SendIcon />
			</button>
		{/if}
	</div>

	<div class="disclaimer">
		<span class="disclaimer-icon"><LightbulbIcon /></span>
		Model responses may not always be accurate.
	</div>
</div>

<style>
	.input-area {
		padding: 1.25rem;
		background: linear-gradient(135deg, var(--color-background-secondary) 0%, #fafafa 100%);
		border-top: var(--border-brutalist-thick);
		position: relative;
		overflow: hidden;
	}

	.input-decoration {
		position: absolute;
		top: -2px;
		left: 0;
		right: 0;
		height: 3px;
		background: repeating-linear-gradient(
			90deg,
			var(--color-success),
			var(--color-success) 8px,
			var(--color-primary-dark) 8px,
			var(--color-primary-dark) 16px
		);
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
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		padding: 0;
		box-shadow: 5px 5px 0 var(--color-border-primary);
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.2s;
		margin-bottom: 0.75rem;
		transform: rotate(-0.5deg);
		position: relative;
	}

	.input-emoji {
		position: absolute;
		top: -15px;
		left: 10px;
		font-size: 1.5rem;
		z-index: 1;
		background: var(--color-success);
		padding: 0 8px;
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		animation: bounce-emoji 3s ease-in-out infinite;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.input-emoji :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
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
		box-shadow: 7px 7px 0 var(--color-border-primary);
	}

	.message-input.is-disabled {
		background: linear-gradient(
			135deg,
			var(--color-background-tertiary) 0%,
			var(--color-background-pattern) 100%
		);
		opacity: 0.7;
	}

	textarea {
		flex-grow: 1;
		padding: 0.875rem 1rem;
		padding-top: 1.25rem;
		border: none;
		resize: none;
		font-family: var(--font-family-primary);
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.4;
		background: transparent;
		min-height: 22px;
		max-height: 120px;
		outline: none;
		color: var(--color-text-primary);
	}

	textarea::placeholder {
		color: var(--color-text-disabled);
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
		background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-warning) 100%);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thin);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-small);
		transform: rotate(5deg);
	}

	.send-btn :global(svg) {
		width: 20px;
		height: 20px;
	}

	.send-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-hover) 100%);
		transform: scale(1.1) rotate(0deg);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.send-btn:active:not(:disabled) {
		transform: scale(0.95);
		box-shadow: 1px 1px 0 var(--color-border-primary);
	}

	.send-btn:disabled {
		background: var(--color-background-disabled);
		cursor: not-allowed;
		opacity: 0.5;
		transform: rotate(0deg);
	}

	.stop-btn-inline {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		margin: 8px;
		align-self: center;
		background: linear-gradient(135deg, var(--color-danger) 0%, var(--color-danger-hover) 100%);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thin);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-small);
		transform: rotate(-2deg);
		animation: pulse-stop 1s ease-in-out infinite;
	}

	.stop-btn-inline :global(svg) {
		width: 20px;
		height: 20px;
	}

	@keyframes pulse-stop {
		0%,
		100% {
			transform: rotate(-2deg) scale(1);
		}
		50% {
			transform: rotate(-2deg) scale(1.05);
		}
	}

	.stop-btn-inline:hover {
		background: linear-gradient(135deg, #ff8a80 0%, var(--color-danger) 100%);
		transform: scale(1.1) rotate(0deg);
		box-shadow: var(--shadow-brutalist-medium);
		animation: none;
	}

	.stop-btn-inline:active {
		transform: scale(0.95) rotate(0deg);
		box-shadow: 1px 1px 0 var(--color-border-primary);
	}

	.disclaimer {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--color-text-tertiary);
		text-align: center;
		background: var(--color-background-tertiary);
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-gray-200);
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
		display: flex;
		align-items: center;
		color: var(--color-text-tertiary);
	}

	.disclaimer-icon :global(svg) {
		width: 0.875rem;
		height: 0.875rem;
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

		.input-emoji :global(svg) {
			width: 1.25rem;
			height: 1.25rem;
		}
	}
</style>
