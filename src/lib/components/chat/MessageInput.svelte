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
	<div class="input-decoration">
		<svg viewBox="0 0 100 4" width="100%" height="4">
			<path d="M0,2 Q25,0.5 50,2 T100,2" stroke="#5a8c69" stroke-width="1.5" opacity="0.6" />
			<circle cx="20" cy="1.5" r="0.8" fill="#4a7c59" opacity="0.4" />
			<circle cx="50" cy="2.5" r="0.6" fill="#3a6e4a" opacity="0.3" />
			<circle cx="80" cy="1" r="1" fill="#5a8c69" opacity="0.4" />
		</svg>
	</div>

	<div class="message-input" class:is-disabled={isGenerating}>
		<div class="input-decoration-element">
			<svg viewBox="0 0 24 20" width="20" height="16">
				<!-- Wood grain texture pattern -->
				<path
					d="M2,4 Q6,2 10,4 Q14,6 18,4 Q20,3 22,4"
					stroke="#8b5a3c"
					stroke-width="1"
					opacity="0.5"
					fill="none"
				/>
				<path
					d="M2,8 Q8,6 12,8 Q16,10 22,8"
					stroke="#6b4c3a"
					stroke-width="0.8"
					opacity="0.4"
					fill="none"
				/>
				<path
					d="M2,12 Q10,10 18,12 Q20,13 22,12"
					stroke="#8b5a3c"
					stroke-width="0.6"
					opacity="0.3"
					fill="none"
				/>
				<path
					d="M2,16 Q6,14 14,16 Q18,18 22,16"
					stroke="#a67c5a"
					stroke-width="0.5"
					opacity="0.3"
					fill="none"
				/>
			</svg>
		</div>
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
				<svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
					<rect x="6" y="6" width="8" height="8" rx="1" />
				</svg>
			</button>
		{:else}
			<button
				onclick={onSend}
				disabled={isGenerating || !value.trim()}
				class="send-btn"
				aria-label="Send message"
			>
				<svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
					<!-- Natural seed/arrow send icon -->
					<path d="M18,10 L12,4 L12,7 L2,7 L2,13 L12,13 L12,16 L18,10 Z" fill="#faf8f5" />
				</svg>
			</button>
		{/if}
	</div>

	<div class="disclaimer">
		<svg class="disclaimer-icon" viewBox="0 0 16 16" width="12" height="12">
			<circle cx="8" cy="8" r="7" fill="none" stroke="#6b4c3a" stroke-width="1" opacity="0.6" />
			<circle cx="8" cy="5" r="1" fill="#6b4c3a" opacity="0.7" />
			<path d="M8,7 L8,12" stroke="#6b4c3a" stroke-width="1.5" opacity="0.7" />
		</svg>
		Garden AI responses may not always reflect natural accuracy.
	</div>
</div>

<style>
	.input-area {
		padding: 1.5rem;
		background: linear-gradient(135deg, rgba(139, 90, 60, 0.05) 0%, rgba(107, 76, 58, 0.03) 100%);
		border-top: 1px solid rgba(74, 124, 89, 0.2);
		position: relative;
		overflow: hidden;
	}

	.input-decoration {
		position: absolute;
		top: -1px;
		left: 0;
		right: 0;
		height: 4px;
		padding: 0 1rem;
		box-sizing: border-box;
	}

	.message-input {
		display: flex;
		align-items: flex-end;
		background: linear-gradient(
			135deg,
			rgba(250, 248, 245, 0.95) 0%,
			rgba(245, 242, 236, 0.9) 100%
		);
		border: 1px solid rgba(139, 90, 60, 0.2);
		padding: 0;
		box-shadow:
			0 8px 20px rgba(107, 76, 58, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
		border-radius: 18px;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		margin-bottom: 1rem;
		position: relative;
		backdrop-filter: blur(5px);
	}

	.input-decoration-element {
		position: absolute;
		top: -12px;
		left: 12px;
		padding: 0.25rem 0.5rem;
		background: rgba(139, 90, 60, 0.1);
		border: 1px solid rgba(107, 76, 58, 0.2);
		border-radius: 8px;
		z-index: 1;
		backdrop-filter: blur(3px);
		animation: woodGrain 6s ease-in-out infinite;
	}

	@keyframes woodGrain {
		0%,
		100% {
			transform: translateY(0) rotate(-1deg) scale(1);
			opacity: 0.8;
		}
		50% {
			transform: translateY(-2px) rotate(1deg) scale(1.02);
			opacity: 1;
		}
	}

	.message-input:hover:not(.is-disabled) {
		transform: translateY(-1px);
		box-shadow:
			0 12px 28px rgba(107, 76, 58, 0.15),
			inset 0 2px 0 rgba(255, 255, 255, 0.8);
		border-color: rgba(139, 90, 60, 0.3);
	}

	.message-input.is-disabled {
		background: linear-gradient(135deg, rgba(200, 200, 200, 0.5) 0%, rgba(180, 180, 180, 0.4) 100%);
		opacity: 0.6;
		border-color: rgba(139, 90, 60, 0.1);
	}

	textarea {
		flex-grow: 1;
		padding: 1rem 1.25rem;
		padding-top: 1.5rem;
		border: none;
		resize: none;
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.5;
		background: transparent;
		min-height: 24px;
		max-height: 140px;
		outline: none;
		color: #2a2a2a;
	}

	textarea::placeholder {
		color: rgba(107, 76, 58, 0.6);
		font-weight: 400;
		font-style: italic;
	}

	.send-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		margin: 0.5rem;
		align-self: center;
		background: linear-gradient(135deg, #5a8c69 0%, #4a7c59 100%);
		color: #faf8f5;
		border: 1px solid rgba(45, 93, 58, 0.3);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 4px 12px rgba(58, 110, 74, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(3px);
	}

	.send-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #6b9d7a 0%, #5a8c69 100%);
		transform: translateY(-2px) scale(1.05);
		box-shadow:
			0 6px 16px rgba(58, 110, 74, 0.3),
			inset 0 2px 0 rgba(255, 255, 255, 0.3);
		border-color: rgba(74, 124, 89, 0.4);
	}

	.send-btn:active:not(:disabled) {
		transform: translateY(0) scale(0.98);
		box-shadow:
			0 2px 8px rgba(58, 110, 74, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.send-btn:disabled {
		background: rgba(139, 90, 60, 0.2);
		color: rgba(250, 248, 245, 0.4);
		cursor: not-allowed;
		opacity: 0.5;
		transform: none;
		box-shadow: none;
	}

	.stop-btn-inline {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		margin: 0.5rem;
		align-self: center;
		background: linear-gradient(135deg, rgba(139, 90, 60, 0.8) 0%, rgba(107, 76, 58, 0.9) 100%);
		color: #faf8f5;
		border: 1px solid rgba(107, 76, 58, 0.4);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 4px 12px rgba(107, 76, 58, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(3px);
		animation: gentlePulse 2s ease-in-out infinite;
	}

	@keyframes gentlePulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.9;
		}
		50% {
			transform: scale(1.02);
			opacity: 1;
		}
	}

	.stop-btn-inline:hover {
		background: linear-gradient(135deg, rgba(160, 110, 80, 0.9) 0%, rgba(139, 90, 60, 1) 100%);
		transform: translateY(-2px) scale(1.05);
		box-shadow:
			0 6px 16px rgba(107, 76, 58, 0.3),
			inset 0 2px 0 rgba(255, 255, 255, 0.3);
		animation: none;
		border-color: rgba(107, 76, 58, 0.5);
	}

	.stop-btn-inline:active {
		transform: translateY(0) scale(0.98);
		box-shadow:
			0 2px 8px rgba(107, 76, 58, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.disclaimer {
		font-size: 0.8rem;
		font-weight: 400;
		font-family: 'Inter', sans-serif;
		color: rgba(107, 76, 58, 0.8);
		text-align: center;
		background: rgba(139, 90, 60, 0.05);
		padding: 0.75rem 1rem;
		border: 1px solid rgba(107, 76, 58, 0.15);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 0 auto;
		width: fit-content;
		max-width: 350px;
		backdrop-filter: blur(3px);
		box-shadow:
			0 2px 6px rgba(107, 76, 58, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.disclaimer-icon {
		opacity: 0.7;
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
	}
</style>
