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
		<div class="floating-decoration">
			<svg viewBox="0 0 80 80" width="80" height="80">
				<circle cx="20" cy="20" r="3" fill="var(--sage)" opacity="0.4" />
				<circle cx="60" cy="35" r="2" fill="var(--clay)" opacity="0.5" />
				<circle cx="40" cy="60" r="2.5" fill="var(--earth-dark)" opacity="0.3" />
				<path
					d="M10,40 Q40,20 70,40 Q40,60 10,40"
					stroke="var(--earth-medium)"
					stroke-width="1"
					fill="none"
					opacity="0.2"
				/>
			</svg>
		</div>

		<div class="toolbar">
			<span class="model-info">
				<svg viewBox="0 0 16 16" width="16" height="16" class="model-icon">
					<circle cx="8" cy="8" r="6" fill="var(--cream)" opacity="0.8" />
					<circle cx="8" cy="8" r="3" fill="var(--earth-dark)" opacity="0.6" />
				</svg>
				{selectedModel.name}
			</span>
			<button onclick={newChat} class="new-chat-btn" aria-label="New Chat">
				<svg viewBox="0 0 16 16" width="16" height="16" class="btn-icon">
					<path
						d="M8,2 L14,8 L8,14 L2,8 Z"
						fill="var(--cream)"
						stroke="var(--earth-dark)"
						stroke-width="1"
					/>
				</svg>
				New <span class="desktop-only">Conversation</span>
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
		animation: fadeIn 0.6s ease-out;
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
		animation: slideInChat 0.8s ease-out;
		display: flex;
		flex-direction: column;
		height: clamp(520px, 85vh, 920px);
		min-height: 0;
	}

	@media (max-width: 600px) {
		.chat-interface {
			height: 85vh;
		}
	}

	@keyframes slideInChat {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.floating-decoration {
		position: absolute;
		top: -20px;
		right: -20px;
		z-index: 0;
		pointer-events: none;
		opacity: 0.6;
	}

	.model-icon {
		margin-right: 0.5rem;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
	}

	.btn-icon {
		margin-right: 0.5rem;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	.new-chat-btn {
		padding: 0.6rem 1.25rem;
		background: rgba(245, 241, 235, 0.9);
		color: var(--text-primary);
		border: 1px solid var(--earth-dark);
		border-radius: 1.5rem;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.3s ease;
		letter-spacing: 0.02em;
		font-family: 'Space Grotesk', 'Georgia', serif;
		white-space: nowrap;
		box-shadow:
			0 2px 8px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		display: flex;
		align-items: center;
		backdrop-filter: blur(10px);
	}

	.new-chat-btn:hover {
		transform: translateY(-2px);
		box-shadow:
			0 4px 12px rgba(139, 111, 71, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		background: var(--cream);
	}

	@media (max-width: 600px) {
		.loading {
			align-items: stretch;
			margin: 1rem 0;
		}

		.new-chat-btn {
			padding: 0.5rem 1rem;
			font-size: 0.85rem;
		}

		.desktop-only {
			display: none;
		}

		.floating-decoration {
			display: none;
		}
	}

	@media (max-width: 400px) {
		.loading {
			margin: 0.5rem 0;
		}
	}
</style>
