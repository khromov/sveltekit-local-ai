<script lang="ts">
	import type { Message } from '$lib/wllama-config';

	interface Props {
		message: Message;
		isGenerating?: boolean;
		isLast?: boolean;
	}

	let { message, isGenerating = false, isLast = false }: Props = $props();
</script>

{#if message.role !== 'system'}
	<div class="message-wrapper {message.role}-wrapper">
		{#if message.role === 'user'}
			<div class="message-decoration user-decoration">
				<svg viewBox="0 0 20 20" width="20" height="20">
					<circle cx="10" cy="10" r="6" fill="var(--clay)" opacity="0.3" />
					<circle cx="10" cy="10" r="2" fill="var(--earth-dark)" opacity="0.6" />
				</svg>
			</div>
		{:else}
			<div class="message-decoration assistant-decoration">
				<svg viewBox="0 0 20 20" width="20" height="20">
					<path d="M6,10 Q10,6 14,10 Q10,14 6,10" fill="var(--sage)" opacity="0.4" />
				</svg>
			</div>
		{/if}

		<div class="message {message.role}-message">
			<div class="message-content">
				{#if message.role === 'assistant' && isGenerating && isLast}
					{#if message.content === ''}
						<div class="thinking-indicator">
							<svg viewBox="0 0 24 24" width="20" height="20" class="thinking-icon">
								<circle cx="6" cy="12" r="2" fill="var(--earth-dark)" opacity="0.6">
									<animate
										attributeName="opacity"
										values="0.6;1;0.6"
										dur="1.5s"
										repeatCount="indefinite"
									/>
								</circle>
								<circle cx="12" cy="12" r="2" fill="var(--earth-dark)" opacity="0.6">
									<animate
										attributeName="opacity"
										values="0.6;1;0.6"
										dur="1.5s"
										begin="0.2s"
										repeatCount="indefinite"
									/>
								</circle>
								<circle cx="18" cy="12" r="2" fill="var(--earth-dark)" opacity="0.6">
									<animate
										attributeName="opacity"
										values="0.6;1;0.6"
										dur="1.5s"
										begin="0.4s"
										repeatCount="indefinite"
									/>
								</circle>
							</svg>
							<span>thinking...</span>
						</div>
					{:else}
						{message.content}
						<span class="cursor-pulse">|</span>
					{/if}
				{:else}
					{message.content}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.message-wrapper {
		display: flex;
		margin-bottom: 1.5rem;
		width: 100%;
		animation: messageSlide 0.6s ease-out;
		position: relative;
		padding: 0 1rem;
		box-sizing: border-box;
	}

	@keyframes messageSlide {
		from {
			opacity: 0;
			transform: translateY(15px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.message-decoration {
		position: absolute;
		width: 20px;
		height: 20px;
		z-index: 1;
		opacity: 0.7;
	}

	.user-decoration {
		right: -10px;
		top: 10px;
		animation: gentleFloat 6s ease-in-out infinite;
	}

	.assistant-decoration {
		left: -10px;
		top: 10px;
		animation: gentleFloat 6s ease-in-out infinite reverse;
	}

	@keyframes gentleFloat {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	.user-wrapper {
		justify-content: flex-end;
	}

	.assistant-wrapper {
		justify-content: flex-start;
	}

	.message {
		position: relative;
		max-width: 75%;
		word-wrap: break-word;
		overflow-wrap: break-word;
		min-width: 0;
		overflow: visible;
	}

	.message-content {
		padding: 1.25rem 1.5rem;
		font-size: 1rem;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
		border: 1px solid var(--earth-medium);
		position: relative;
		font-weight: 400;
		border-radius: 1.5rem;
		transition: all 0.3s ease;
		overflow: visible;
		letter-spacing: 0.01em;
		backdrop-filter: blur(10px);
	}

	.user-message .message-content {
		background: linear-gradient(
			135deg,
			rgba(193, 154, 107, 0.15) 0%,
			rgba(167, 132, 106, 0.1) 100%
		);
		color: var(--text-primary);
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.6);
		border-bottom-right-radius: 0.5rem;
	}

	.user-message .message-content:hover {
		transform: translateY(-1px);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.user-message .message-content::before {
		content: 'You';
		position: absolute;
		top: -14px;
		right: 0;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		letter-spacing: 0.05em;
		background: rgba(245, 241, 235, 0.9);
		padding: 2px 8px;
		border: 1px solid var(--earth-medium);
		border-radius: 0.75rem;
		box-shadow: 0 2px 8px rgba(139, 111, 71, 0.1);
		backdrop-filter: blur(5px);
	}

	.assistant-message .message-content {
		background: linear-gradient(135deg, rgba(245, 241, 235, 0.8) 0%, rgba(230, 221, 212, 0.6) 100%);
		color: var(--text-primary);
		box-shadow:
			0 4px 15px rgba(139, 111, 71, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		border-bottom-left-radius: 0.5rem;
	}

	.assistant-message .message-content:hover {
		transform: translateY(-1px);
		box-shadow:
			0 6px 20px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.assistant-message .message-content::before {
		content: 'AI';
		position: absolute;
		top: -14px;
		left: 0;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		letter-spacing: 0.05em;
		background: rgba(156, 175, 136, 0.2);
		padding: 2px 8px;
		border: 1px solid var(--sage);
		border-radius: 0.75rem;
		box-shadow: 0 2px 8px rgba(139, 111, 71, 0.1);
		backdrop-filter: blur(5px);
	}

	.thinking-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		color: var(--text-secondary);
		font-style: italic;
		font-size: 0.95rem;
	}

	.thinking-icon {
		opacity: 0.8;
	}

	.cursor-pulse {
		display: inline-block;
		animation: pulse 1.2s infinite;
		color: var(--mocha-mousse);
		font-weight: 300;
		margin-left: 2px;
	}

	@keyframes pulse {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	@media (max-width: 600px) {
		.message {
			max-width: 85%;
		}

		.message-wrapper {
			padding: 0 0.75rem;
		}

		.message-content {
			padding: 1rem 1.25rem;
			font-size: 0.95rem;
		}

		.user-message .message-content::before,
		.assistant-message .message-content::before {
			font-size: 0.7rem;
		}

		.message-decoration {
			display: none;
		}
	}
</style>
