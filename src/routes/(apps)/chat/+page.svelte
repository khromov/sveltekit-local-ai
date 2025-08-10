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
		<!-- Natural organic decorations -->
		<div class="natural-decoration leaf-decoration-1">
			<svg viewBox="0 0 30 40" width="30" height="40">
				<ellipse
					cx="15"
					cy="20"
					rx="8"
					ry="18"
					fill="#5a8c69"
					opacity="0.6"
					transform="rotate(-15 15 20)"
				/>
				<path d="M15,2 Q12,20 15,38" stroke="#4a7c59" stroke-width="2" opacity="0.4" />
			</svg>
		</div>
		<div class="natural-decoration leaf-decoration-2">
			<svg viewBox="0 0 25 35" width="25" height="35">
				<ellipse
					cx="12"
					cy="17"
					rx="6"
					ry="15"
					fill="#3a6e4a"
					opacity="0.5"
					transform="rotate(20 12 17)"
				/>
				<path d="M12,3 Q15,17 12,31" stroke="#2d5d3a" stroke-width="1.5" opacity="0.3" />
			</svg>
		</div>

		<div class="toolbar">
			<span class="model-info">
				<svg class="model-icon" viewBox="0 0 20 20" width="16" height="16">
					<circle cx="10" cy="10" r="8" fill="#faf8f5" stroke="#4a7c59" stroke-width="1.5" />
					<circle cx="7" cy="8" r="1.5" fill="#4a7c59" />
					<circle cx="13" cy="8" r="1.5" fill="#4a7c59" />
					<path d="M6,13 Q10,16 14,13" stroke="#4a7c59" stroke-width="1.5" fill="none" />
				</svg>
				{selectedModel.name}
			</span>
			<button onclick={newChat} class="new-chat-btn" aria-label="New Chat">
				<svg class="btn-icon" viewBox="0 0 16 16" width="14" height="14">
					<path
						d="M8,2 L12,6 L8,10 M4,6 L12,6"
						stroke="currentColor"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
					/>
				</svg>
				New <span class="desktop-only">Conversation</span>
			</button>
			<div class="toolbar-decoration">
				<svg viewBox="0 0 100 4" width="100%" height="4">
					<path d="M0,2 Q25,1 50,2 T100,2" stroke="#3a6e4a" stroke-width="1" opacity="0.4" />
				</svg>
			</div>
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

	.natural-decoration {
		position: absolute;
		z-index: -1;
		pointer-events: none;
	}

	.leaf-decoration-1 {
		top: -10px;
		right: 15px;
		animation: naturalFloat1 12s ease-in-out infinite;
	}

	.leaf-decoration-2 {
		bottom: 120px;
		left: 10px;
		animation: naturalFloat2 15s ease-in-out infinite;
	}

	@keyframes naturalFloat1 {
		0%,
		100% {
			transform: translate(0, 0) rotate(-5deg) scale(1);
			opacity: 0.6;
		}
		33% {
			transform: translate(-3px, 8px) rotate(2deg) scale(1.05);
			opacity: 0.8;
		}
		66% {
			transform: translate(5px, -5px) rotate(-2deg) scale(0.95);
			opacity: 0.5;
		}
	}

	@keyframes naturalFloat2 {
		0%,
		100% {
			transform: translate(0, 0) rotate(10deg) scale(1);
			opacity: 0.5;
		}
		40% {
			transform: translate(8px, -3px) rotate(-5deg) scale(1.1);
			opacity: 0.7;
		}
		80% {
			transform: translate(-5px, 6px) rotate(8deg) scale(0.9);
			opacity: 0.4;
		}
	}

	.toolbar-decoration {
		position: absolute;
		bottom: -2px;
		left: 0;
		right: 0;
		height: 4px;
		opacity: 0.7;
	}

	.model-icon {
		margin-right: 0.5rem;
		opacity: 0.8;
	}

	.btn-icon {
		margin-right: 0.375rem;
		opacity: 0.9;
	}

	.new-chat-btn {
		padding: 0.75rem 1.25rem;
		background: rgba(90, 140, 105, 0.9);
		color: #faf8f5;
		border: 1px solid rgba(58, 110, 74, 0.3);
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 600;
		font-family: 'Caveat', cursive;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		letter-spacing: 0.3px;
		white-space: nowrap;
		box-shadow:
			0 6px 16px rgba(58, 110, 74, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(5px);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.new-chat-btn:hover {
		transform: translateY(-2px);
		box-shadow:
			0 8px 20px rgba(58, 110, 74, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
		background: rgba(107, 157, 122, 0.95);
		border-color: rgba(74, 124, 89, 0.4);
	}

	@media (max-width: 600px) {
		.loading {
			align-items: stretch;
			margin: 1rem 0;
		}

		.new-chat-btn {
			padding: 0.625rem 1rem;
			font-size: 0.85rem;
		}

		.desktop-only {
			display: none;
		}

		.natural-decoration {
			opacity: 0.5;
			transform: scale(0.8);
		}
	}

	@media (max-width: 400px) {
		.loading {
			margin: 0.5rem 0;
		}
	}
</style>
