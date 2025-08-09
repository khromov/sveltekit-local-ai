<script lang="ts">
	import { onMount } from 'svelte';
	import { pipeline, type TextGenerationPipeline } from '@xenova/transformers';
	import { messages, inferenceParams } from '$lib/stores';
	import type { Message } from '$lib/chat-config';

	// Import components
	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import ChatMessages from '$lib/components/chat/ChatMessages.svelte';
	import MessageInput from '$lib/components/chat/MessageInput.svelte';

	// State variables
	let generator: TextGenerationPipeline;
	let isLoading = $state(true);
	let isModelLoaded = $state(false);
	let isGenerating = $state(false);
	let downloadProgress = $state(0);
	let previousProgress = $state(0);
	let downloadError = $state(false);
	let inputText = $state('');
	let stopSignal = false;
	let chatMessagesComponent: ChatMessages | undefined = $state();
	let messageInputComponent: MessageInput | undefined = $state();

	const MODEL = "Xenova/llama-3.2-8b-it-gguf";
	const QUANTIZED_MODEL = "Xenova/llama-3.2-8b-it-gguf";

	onMount(async () => {
		await loadModel();
	});

	async function loadModel() {
		try {
			isLoading = true;
			downloadError = false;
			downloadProgress = 0;
			previousProgress = 0;

			generator = await pipeline('text-generation', QUANTIZED_MODEL, {
				progress_callback: (progress: any) => {
					previousProgress = downloadProgress;
					downloadProgress = Math.round(progress.progress);
					console.log(`Downloading... ${downloadProgress}%`);
				},
			});

			isModelLoaded = true;
		} catch (err) {
			console.error('Model loading error:', err);
			downloadError = true;
		} finally {
			isLoading = false;
		}
	}

	async function sendMessage() {
		if (!isModelLoaded || isGenerating || !inputText.trim()) {
			return;
		}

		const userMessage: Message = { role: 'user', content: inputText };
		$messages = [...$messages, userMessage];
		chatMessagesComponent?.scrollToBottom();

		const assistantMessage: Message = { role: 'assistant', content: '' };
		$messages = [...$messages, assistantMessage];
		chatMessagesComponent?.scrollToBottom();

		inputText = '';
		isGenerating = true;
		stopSignal = false;

		const stream = await generator($messages, {
			max_new_tokens: $inferenceParams.nPredict,
			temperature: $inferenceParams.temperature,
			do_sample: $inferenceParams.temperature > 0,
		});

		for await (const chunk of stream) {
			if (stopSignal) {
				generator.dispose();
				loadModel(); // To re-initialize the generator
				break;
			}
			const outputToken = chunk;
			$messages[$messages.length - 1].content += outputToken;
			$messages = [...$messages];
			chatMessagesComponent?.scrollToBottom();
		}

		isGenerating = false;
		messageInputComponent?.focus();
	}

	function newChat() {
		if (isGenerating) {
			stopSignal = true;
		}
		$messages = [];
		messageInputComponent?.focus();
	}

	onMount(() => {
		if ($messages.length === 0) {
			$messages = [
				{
					role: 'system',
					content: "You are a helpful AI assistant. Answer the user's questions concisely and accurately."
				}
			];
		}
		if (isModelLoaded) {
			messageInputComponent?.focus();
		}
	});
</script>

{#if !isModelLoaded}
	<div class="loading">
		{#if downloadError}
			<ErrorDisplay
				message="Failed to load model. Please check your connection and try again."
				buttonText={isLoading ? 'Reloading...' : 'Reload Model'}
				onRetry={loadModel}
				isRetrying={isLoading}
			/>
		{:else if isLoading}
			<LoadingProgress
				title="Loading Model"
				progress={downloadProgress}
				{previousProgress}
				message="This will take a couple of minutes. The chat model is being downloaded to your browser."
			/>
		{:else}
			<!-- Empty else block for now -->
		{/if}
	</div>
{:else}
	<div class="card-interface chat-interface">
		<div class="floating-decoration decoration-1"></div>
		<div class="floating-decoration decoration-2"></div>

		<div class="toolbar">
			<span class="model-info">
				<span class="model-emoji">🤖</span>
				Llama 3.2 8B (Transformers.js)
			</span>
			<button onclick={newChat} class="new-chat-btn" aria-label="New Chat">
				<span class="btn-emoji">✨</span>
				New <span class="desktop-only">Chat</span>
			</button>
			<div class="toolbar-decoration"></div>
		</div>

		<ChatMessages bind:this={chatMessagesComponent} messages={$messages} {isGenerating} />

		<MessageInput
			bind:this={messageInputComponent}
			bind:value={inputText}
			{isGenerating}
			onSend={sendMessage}
			onStop={() => stopSignal = true}
		/>
	</div>
{/if}

<style>
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin: 2rem 0;
		animation: fadeIn 0.4s ease-out;
		width: 100%;
		box-sizing: border-box;
		overflow-x: hidden;
		padding: 0;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.chat-interface {
		position: relative;
		transform: rotate(0deg);
		animation: slideInChat 0.5s ease-out;
		display: flex;
		flex-direction: column;
		/* Fix the card height relative to the viewport so only the messages list scrolls */
		height: clamp(520px, 85vh, 920px);
		min-height: 0; /* important for inner flex child scrolling */
	}

	@media (max-width: 600px) {
		.chat-interface {
			height: 85vh;
		}
	}

	@keyframes slideInChat {
		from {
			opacity: 0;
			transform: translateY(20px) rotate(0deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(0deg);
		}
	}

	.floating-decoration {
		position: absolute;
		background: linear-gradient(135deg, #ffd93d 0%, #ff69b4 100%);
		border: 3px solid #000;
		opacity: 0.2;
		z-index: -1;
		pointer-events: none;
	}

	.decoration-1 {
		width: 80px;
		height: 80px;
		top: -20px;
		right: -20px;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		animation: float1 8s ease-in-out infinite;
	}

	.decoration-2 {
		width: 60px;
		height: 60px;
		bottom: 100px;
		left: -15px;
		border-radius: 70% 30% 30% 70% / 40% 60% 40% 60%;
		animation: float2 10s ease-in-out infinite;
	}

	@keyframes float1 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(-10px, 10px) rotate(180deg);
		}
	}

	@keyframes float2 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(10px, -10px) rotate(-180deg);
		}
	}

	.toolbar-decoration {
		position: absolute;
		bottom: -6px;
		left: 0;
		right: 0;
		height: 3px;
		background: repeating-linear-gradient(90deg, #000, #000 8px, #98fb98 8px, #98fb98 16px);
	}

	.model-emoji {
		font-size: 1.125rem;
		margin-right: 0.25rem;
	}

	.btn-emoji {
		font-size: 1rem;
	}

	.new-chat-btn {
		padding: 0.5rem 1rem;
		background: #98fb98;
		color: #000;
		border: 2px solid #000;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		white-space: nowrap;
		box-shadow: 3px 3px 0 #000;
		display: flex;
		align-items/center;
		gap: 0.375rem;
		transform: rotate(0deg);
	}

	.new-chat-btn:hover {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 5px 5px 0 #000;
		background: #ffd93d;
	}

	/* Responsive adjustments for the main page */
	@media (max-width: 600px) {
.loading {
			align-items: stretch;
			margin: 1rem 0;
		}

		.new-chat-btn {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}

		/* Hide the extra word on small screens */
		.desktop-only {
			display: none;
		}

		.decoration-1,
		.decoration-2 {
			display: none;
		}
	}

	@media (max-width: 400px) {
		.loading {
			margin: 0.5rem 0;
		}
	}
</style>
