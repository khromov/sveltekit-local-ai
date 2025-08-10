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
		<!-- Nature decorations -->
		<svg class="floating-decoration decoration-1" width="60" height="60" viewBox="0 0 60 60">
			<g opacity="0.1">
				<circle
					cx="30"
					cy="30"
					r="25"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					stroke-dasharray="2 4"
				/>
				<path
					d="M30,10 Q25,20 25,30 Q25,40 30,50 Q35,40 35,30 Q35,20 30,10"
					fill="currentColor"
					opacity="0.3"
				/>
			</g>
		</svg>

		<svg class="floating-decoration decoration-2" width="50" height="50" viewBox="0 0 50 50">
			<g opacity="0.1">
				<circle cx="25" cy="25" r="20" fill="currentColor" opacity="0.2" />
				<circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" stroke-width="1" />
				<circle cx="25" cy="25" r="5" fill="currentColor" opacity="0.3" />
			</g>
		</svg>

		<div class="toolbar">
			<span class="model-info">
				<svg
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					style="display: inline-block; vertical-align: middle; margin-right: 6px;"
				>
					<circle
						cx="9"
						cy="9"
						r="7"
						stroke="currentColor"
						stroke-width="1.5"
						fill="currentColor"
						fill-opacity="0.2"
					/>
					<path d="M9 3Q7 6 7 9Q7 12 9 15Q11 12 11 9Q11 6 9 3" fill="currentColor" opacity="0.5" />
				</svg>
				{selectedModel.name}
			</span>
			<button onclick={newChat} class="new-chat-btn" aria-label="New Chat">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" />
					<path
						d="M8 5V11M5 8H11"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
				<span class="desktop-only">New Chat</span>
			</button>
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
		animation: slideInChat 0.5s ease-out;
		display: flex;
		flex-direction: column;
		height: clamp(520px, 85vh, 920px);
		min-height: 0;
		overflow: visible;
	}

	@media (max-width: 600px) {
		.chat-interface {
			height: 85vh;
		}
	}

	@keyframes slideInChat {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.floating-decoration {
		position: absolute;
		color: var(--forest-primary);
		opacity: 0.15;
		z-index: 0;
		pointer-events: none;
	}

	.decoration-1 {
		top: -20px;
		right: -20px;
		animation: float1 12s ease-in-out infinite;
	}

	.decoration-2 {
		bottom: 100px;
		left: -15px;
		animation: float2 15s ease-in-out infinite;
	}

	@keyframes float1 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(-10px, 10px) rotate(90deg);
		}
	}

	@keyframes float2 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(10px, -10px) rotate(-90deg);
		}
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.125rem 1.5rem;
		background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		flex-wrap: wrap;
		gap: 0.5rem;
		position: relative;
		overflow: hidden;
		z-index: 1;
	}

	.toolbar::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			90deg,
			transparent,
			transparent 100px,
			rgba(255, 255, 255, 0.05) 100px,
			rgba(255, 255, 255, 0.05) 200px
		);
		pointer-events: none;
	}

	.model-info {
		font-size: 0.9375rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.95);
		letter-spacing: 0.02em;
		word-break: break-word;
		max-width: 100%;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
	}

	.new-chat-btn {
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 10px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.3s ease;
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		backdrop-filter: blur(10px);
	}

	.new-chat-btn:hover {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.new-chat-btn:active {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 600px) {
		.loading {
			align-items: stretch;
			margin: 1rem 0;
		}

		.toolbar {
			padding: 1rem 1.25rem;
		}

		.model-info {
			font-size: 0.875rem;
		}

		.new-chat-btn {
			padding: 0.425rem 0.75rem;
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
