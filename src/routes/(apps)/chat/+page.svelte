<script lang="ts">
	import { Wllama, type DownloadProgressCallback } from '@wllama/wllama';
	import { onMount } from 'svelte';
	import { Template } from '@huggingface/jinja';
	import {
		WLLAMA_CONFIG_PATHS,
		DEFAULT_CHAT_TEMPLATE,
		AVAILABLE_MODELS,
		type Message
	} from '$lib/wllama-config';
	import { useWakeLock } from '$lib/wakeLock.svelte';
	import { messages, inferenceParams } from '$lib/stores';

	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import ModelSelector from '$lib/components/chat/ModelSelector.svelte';
	import ChatMessages from '$lib/components/chat/ChatMessages.svelte';
	import MessageInput from '$lib/components/chat/MessageInput.svelte';

	let wllama: Wllama;
	let isLoading = $state(false);
	let isModelLoaded = $state(false);
	let isGenerating = $state(false);
	let downloadProgress = $state(0);
	let previousProgress = $state(0);
	let downloadError = $state(false);
	let modelSelection = $state(AVAILABLE_MODELS[0].url);
	let selectedModel = $state(AVAILABLE_MODELS[0]);
	let inputText = $state('');
	let stopSignal = false;
	let chatMessagesComponent: ChatMessages | undefined = $state();
	let messageInputComponent: MessageInput | undefined = $state();

	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	onMount(() => {
		return setupWakeLock(() => isGenerating);
	});

	async function loadModel() {
		try {
			isLoading = true;
			downloadError = false;
			downloadProgress = 0;
			previousProgress = 0;

			const model = AVAILABLE_MODELS.find((m) => m.url === modelSelection);
			if (model) {
				selectedModel = model;
			}

			// TODO: Cleanup
			wllama = new Wllama(WLLAMA_CONFIG_PATHS);

			const progressCallback: DownloadProgressCallback = ({ loaded, total }) => {
				previousProgress = downloadProgress;
				downloadProgress = Math.round((loaded / total) * 100);
				console.log(`Downloading... ${downloadProgress}%`);
			};

			await wllama.loadModelFromUrl(modelSelection, {
				progressCallback,
				n_threads: $inferenceParams.nThreads > 0 ? $inferenceParams.nThreads : undefined,
				n_ctx: $inferenceParams.nContext,
				n_batch: $inferenceParams.nBatch
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

		const userMessage: Message = {
			role: 'user',
			content: inputText
		};

		$messages = [...$messages, userMessage];

		chatMessagesComponent?.scrollToBottom();

		const assistantMessage: Message = {
			role: 'assistant',
			content: ''
		};

		$messages = [...$messages, assistantMessage];

		chatMessagesComponent?.scrollToBottom();

		inputText = '';
		isGenerating = true;
		stopSignal = false;

		await requestWakeLock();

		try {
			let formattedChat = await formatChatHistory($messages.slice(0, -1));
			console.log('Formatted chat:', formattedChat);

			const result = await wllama.createCompletion(formattedChat, {
				nPredict: $inferenceParams.nPredict,
				sampling: {
					temp: $inferenceParams.temperature
				},
				useCache: true,
				onNewToken: (_token, _piece, currentText, optionals) => {
					console.log('New token received, current text length:', currentText.length);
					const updatedMessages = [...$messages];
					updatedMessages[updatedMessages.length - 1] = {
						...updatedMessages[updatedMessages.length - 1],
						content: currentText
					};
					$messages = updatedMessages;

					chatMessagesComponent?.scrollToBottom();

					if (stopSignal) {
						optionals.abortSignal();
					}
				}
			});

			const finalMessages = [...$messages];
			finalMessages[finalMessages.length - 1] = {
				...finalMessages[finalMessages.length - 1],
				content: result
			};
			$messages = finalMessages;
		} catch (err) {
			console.error('Generation error:', err);
		} finally {
			isGenerating = false;

			await releaseWakeLock();

			messageInputComponent?.focus();
		}
	}

	async function stopGeneration() {
		stopSignal = true;

		await releaseWakeLock();
	}

	async function formatChatHistory(msgs: Message[]): Promise<string> {
		try {
			const templateStr = wllama.getChatTemplate() || DEFAULT_CHAT_TEMPLATE;

			// Special handling for DeepSeek models that cause issues with jinja
			const isDeepSeekR1 =
				templateStr.match(/<｜Assistant｜>/) &&
				templateStr.match(/<｜User｜>/) &&
				templateStr.match(/<\/think>/);

			if (isDeepSeekR1) {
				let result = '';
				for (const message of msgs) {
					if (message.role === 'system') {
						result += `${message.content}\n\n`;
					} else if (message.role === 'user') {
						result += `<｜User｜>${message.content}`;
					} else {
						result += `<｜Assistant｜>${message.content.split('</think>').pop()}<｜end▁of▁sentence｜>`;
					}
				}
				return result + '<｜Assistant｜>';
			}

			const template = new Template(templateStr);
			const bos_token = await wllama.detokenize([wllama.getBOS()], true);
			const eos_token = await wllama.detokenize([wllama.getEOS()], true);

			return template.render({
				messages: msgs,
				bos_token,
				eos_token,
				add_generation_prompt: true
			});
		} catch (err) {
			console.error('Error formatting chat:', err);
			return msgs.map((m) => `${m.role}: ${m.content}`).join('\n\n') + '\n\nassistant: ';
		}
	}

	function newChat() {
		if (isGenerating) {
			stopGeneration();
		}
		$messages = [];

		messageInputComponent?.focus();
	}

	onMount(() => {
		if ($messages.length === 0) {
			$messages = [
				{
					role: 'system',
					content:
						"You are a helpful AI assistant. Answer the user's questions concisely and accurately."
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
			<ModelSelector bind:modelSelection onLoadModel={loadModel} {isLoading} />
		{/if}
	</div>
{:else}
	<div class="card-interface chat-interface">
		<div class="floating-decoration decoration-1"></div>
		<div class="floating-decoration decoration-2"></div>

		<div class="toolbar">
			<span class="model-info">
				<span class="model-emoji">🤖</span>
				{selectedModel.name}
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
			onStop={stopGeneration}
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
		background: linear-gradient(135deg, rgba(82, 121, 82, 0.1) 0%, rgba(107, 142, 107, 0.05) 100%);
		border: 1px solid rgba(82, 121, 82, 0.15);
		opacity: 0.6;
		z-index: -1;
		pointer-events: none;
		border-radius: 50%;
	}

	.decoration-1 {
		width: 120px;
		height: 120px;
		top: -30px;
		right: -30px;
		animation: gentle-float1 12s ease-in-out infinite;
	}

	.decoration-2 {
		width: 80px;
		height: 80px;
		bottom: 120px;
		left: -20px;
		animation: gentle-float2 15s ease-in-out infinite;
	}

	@keyframes gentle-float1 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
			opacity: 0.6;
		}
		33% {
			transform: translate(-8px, 5px) scale(1.05);
			opacity: 0.4;
		}
		66% {
			transform: translate(5px, -8px) scale(0.95);
			opacity: 0.8;
		}
	}

	@keyframes gentle-float2 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
			opacity: 0.6;
		}
		50% {
			transform: translate(6px, -6px) scale(1.1);
			opacity: 0.3;
		}
	}

	.toolbar-decoration {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			rgba(82, 121, 82, 0.3) 0%,
			rgba(107, 142, 107, 0.2) 50%,
			rgba(82, 121, 82, 0.3) 100%
		);
	}

	.model-emoji {
		font-size: 1.125rem;
		margin-right: 0.5rem;
		filter: drop-shadow(0 1px 3px rgba(255, 255, 255, 0.3));
	}

	.btn-emoji {
		font-size: 1rem;
	}

	.new-chat-btn {
		padding: 0.625rem 1.25rem;
		background: rgba(255, 255, 255, 0.9);
		color: #527952;
		border: 1px solid rgba(82, 121, 82, 0.3);
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-transform: none;
		letter-spacing: 0.01em;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		white-space: nowrap;
		box-shadow: 0 4px 16px rgba(82, 121, 82, 0.15);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		backdrop-filter: blur(8px);
	}

	.new-chat-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(82, 121, 82, 0.25);
		background: rgba(255, 255, 255, 1);
		border-color: rgba(82, 121, 82, 0.4);
		color: #2e4a2e;
	}

	@media (max-width: 600px) {
		.loading {
			align-items: stretch;
			margin: 1rem 0;
		}

		.new-chat-btn {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}

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
