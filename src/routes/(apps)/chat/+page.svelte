<script lang="ts">
	import { Wllama, type DownloadProgressCallback } from '@wllama/wllama';
	import { onMount, onDestroy } from 'svelte';
	import { Template } from '@huggingface/jinja';
	import {
		WLLAMA_CONFIG_PATHS,
		DEFAULT_CHAT_TEMPLATE,
		AVAILABLE_MODELS,
		type Message
	} from '$lib/wllama-config';
	import { useWakeLock } from '$lib/wakeLock.svelte';
	import { messages, inferenceParams } from '$lib/stores';
	import { setModelLoaded } from '$lib/chat-state.svelte';
	import BotIcon from 'virtual:icons/lucide/bot';
	import SparklesIcon from 'virtual:icons/lucide/sparkles';

	import LoadingProgress from '$lib/components/common/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/common/ErrorDisplay.svelte';
	import ModelSelector from '$lib/components/chat/ModelSelector.svelte';
	import ChatMessages from '$lib/components/chat/ChatMessages.svelte';
	import MessageInput from '$lib/components/chat/MessageInput.svelte';
	import CardInterface from '$lib/components/common/CardInterface.svelte';
	import Toolbar from '$lib/components/common/Toolbar.svelte';
	import ActionButton from '$lib/components/common/ActionButton.svelte';

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
	let downloadAbortController: AbortController | null = null;

	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	onMount(() => {
		return setupWakeLock(() => isGenerating);
	});

	onDestroy(() => {
		// Cancel any ongoing download
		if (downloadAbortController) {
			downloadAbortController.abort();
		}

		// Clean up wllama instance if it exists
		if (wllama) {
			wllama.exit();
		}

		// Reset global state
		setModelLoaded(false);
	});

	// Fixes weird Safari bug
	$effect(() => {
		if (isLoading) {
			console.log('isLoading true');
			window.scrollTo(0, 0);
		}
	});

	async function loadModel() {
		try {
			isLoading = true;
			downloadError = false;
			downloadProgress = 0;
			previousProgress = 0;

			// Create new abort controller for this download
			downloadAbortController = new AbortController();

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
				signal: downloadAbortController.signal,
				n_threads: $inferenceParams.nThreads > 0 ? $inferenceParams.nThreads : undefined,
				n_ctx: $inferenceParams.nContext,
				n_batch: $inferenceParams.nBatch
			});

			isModelLoaded = true;
			setModelLoaded(true);
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				console.log('Model download was cancelled');
				return;
			}
			console.error('Model loading error:', err);
			downloadError = true;
		} finally {
			isLoading = false;
			downloadAbortController = null;
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

<div class="chat-page" class:chat-mode={isModelLoaded}>
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
		<CardInterface fixedHeight={true}>
			<Toolbar modelInfo={selectedModel.name} ModelIcon={BotIcon}>
				<ActionButton onClick={newChat} Icon={SparklesIcon}>
					New <span class="desktop-only">Chat</span>
				</ActionButton>
			</Toolbar>

			<ChatMessages bind:this={chatMessagesComponent} messages={$messages} {isGenerating} />

			<MessageInput
				bind:this={messageInputComponent}
				bind:value={inputText}
				{isGenerating}
				onSend={sendMessage}
				onStop={stopGeneration}
			/>
		</CardInterface>
	{/if}
</div>

<style>
	/* Chat page wrapper */
	.chat-page {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	/* When in chat mode (model loaded), apply height constraints */
	.chat-page.chat-mode {
		/* Calculate height accounting for navigation and container padding:
		   - Container padding: 1rem top + 1rem bottom = 2rem
		   - Navigation height: ~0.75rem padding × 2 + ~3rem nav content + 1rem margin-bottom = ~5.5rem
		   - Border thickness: 3px top + 3px bottom = 6px
		   - Box shadow: 5px bottom = 5px
		   Total: ~7.5rem + 11px */
		height: calc(100vh - 7.5rem - 11px);
		overflow: hidden; /* Prevent overall page scroll when chat scrolls */
	}

	/* Apply flex and scrolling constraints to fixed-height CardInterfaces in chat mode */
	.chat-page.chat-mode :global(.card-interface.fixed-height) {
		flex: 1; /* Take remaining space */
		min-height: 0; /* Critical for flex scrolling */
	}

	/* Apply flex and scrolling constraints to content areas in chat mode */
	.chat-page.chat-mode :global(.card-interface.fixed-height .content-area) {
		flex: 1; /* Take remaining space */
		min-height: 0; /* Critical for flex scrolling */
		overflow-y: auto; /* Allow scrolling when needed */
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
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

	@media (max-width: 600px) {
		.chat-page.chat-mode {
			/* Adjust for smaller mobile padding:
			   - Container padding: 0.75rem × 2 = 1.5rem  
			   - Navigation: ~0.5rem padding × 2 + ~2.5rem nav content + 1rem margin = ~4.5rem
			   - Border thickness: 6px + Box shadow: 5px = 11px
			   Total: ~6rem + 11px */
			height: calc(100vh - 6rem - 11px);
		}

		.loading {
			align-items: stretch;
		}

		.desktop-only {
			display: none;
		}
	}

	@media (max-width: 400px) {
		.chat-page.chat-mode {
			/* Adjust for smallest mobile padding:
			   - Container padding: 0.5rem × 2 = 1rem
			   - Navigation: similar to 600px breakpoint = ~4.5rem
			   - Border thickness: 6px + Box shadow: 5px = 11px
			   Total: ~5.5rem + 11px */
			height: calc(100vh - 5.5rem - 11px);
		}
	}
</style>
