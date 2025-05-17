<script lang="ts">
	import { onMount } from 'svelte';
	import { Wllama } from '@wllama/wllama';
	import { WLLAMA_CONFIG_PATHS, AVAILABLE_MODELS, type Message } from '$lib/wllama-config';
	import { inferenceParams } from '$lib/stores';
	import { Template } from '@huggingface/jinja';
	import ModelLoader from '$lib/components/ModelLoader.svelte';
	import LanguageSelector from '$lib/components/translator/LanguageSelector.svelte';
	import TranslationBox from '$lib/components/translator/TranslationBox.svelte';
	import QuirkyCharacter from '$lib/components/translator/QuirkyCharacter.svelte';

	// State variables
	let wllama: Wllama;
	let isModelLoaded = $state(false);
	let isLoading = $state(false);
	let isTranslating = $state(false);
	let downloadProgress = $state(0);
	let previousProgress = $state(0);
	let downloadError = $state(false);
	let selectedModel = $state(AVAILABLE_MODELS[0]);

	// Translation specific state
	let sourceText = $state('');
	let translatedText = $state('');
	let selectedLanguage = $state('Spanish');
	let errorMessage = $state('');
	let confidenceLevel = $state(Math.floor(Math.random() * 60) + 40); // Random 40-99%
	let characterMood = $state('happy');

	// Available languages
	const languages = [
		'Spanish',
		'French',
		'German',
		'Italian',
		'Portuguese',
		'Russian',
		'Japanese',
		'Korean',
		'Chinese',
		'Arabic',
		'Hindi',
		'Bengali',
		'Urdu',
		'Indonesian',
		'Malay',
		'Thai',
		'Vietnamese',
		'Turkish',
		'Polish',
		'Dutch',
		'Swedish',
		'Norwegian',
		'Danish',
		'Finnish',
		'Greek',
		'Hebrew',
		'Czech',
		'Hungarian',
		'Romanian',
		'Ukrainian'
	];

	// Load the model
	async function loadModel() {
		try {
			isLoading = true;
			downloadError = false;
			downloadProgress = 0;
			previousProgress = 0;
			errorMessage = '';

			wllama = new Wllama(WLLAMA_CONFIG_PATHS);

			const progressCallback = ({ loaded, total }) => {
				previousProgress = downloadProgress;
				downloadProgress = Math.round((loaded / total) * 100);
			};

			await wllama.loadModelFromUrl(selectedModel.url, {
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

	// Format chat history for the model using a template
	async function formatChatMessages(messages: Message[]): Promise<string> {
		try {
			const templateStr = wllama?.getChatTemplate() || '';

			// Standard template rendering with jinja
			const template = new Template(templateStr);
			const bos_token = wllama ? await wllama.detokenize([wllama.getBOS()], true) : '';
			const eos_token = wllama ? await wllama.detokenize([wllama.getEOS()], true) : '';

			return template.render({
				messages: messages,
				bos_token,
				eos_token,
				add_generation_prompt: true
			});
		} catch (err) {
			console.error('Error formatting chat:', err);
			// Fallback to basic formatting if template rendering fails
			return messages.map((m) => `${m.role}: ${m.content}`).join('\n\n') + '\n\nassistant: ';
		}
	}

	// Function to translate text
	async function translateText() {
		if (!isModelLoaded || isTranslating || !sourceText.trim() || !selectedLanguage) {
			return;
		}

		isTranslating = true;
		errorMessage = '';
		characterMood = 'thinking';
		confidenceLevel = Math.floor(Math.random() * 60) + 40; // Random 40-99%

		// Create a new chat for translation
		const chatMessages: Message[] = [
			{
				role: 'system',
				content: `You are a quirky but charming translation assistant. Your translations may be slightly awkward but should capture the essence of the original text. Translate directly without adding any explanations or comments.`
			},
			{
				role: 'user',
				content: `Please translate this text to ${selectedLanguage}: "${sourceText}"`
			}
		];

		try {
			// Format chat using the model's template
			const formattedChat = await formatChatMessages(chatMessages);
			let generatedText = '';

			// Generate completion
			await wllama.createCompletion(formattedChat, {
				nPredict: 400, // Increased token limit for translations
				sampling: {
					temp: 0.7
				},
				useCache: true,
				onNewToken: (token, piece, currentText) => {
					generatedText = currentText;
				}
			});

			// Extract just the assistant's response
			let cleanedText = generatedText.trim();

			// Attempt to extract just the response content based on common patterns
			const assistantPrefixes = [
				'assistant:',
				'assistant\n',
				'<|im_start|>assistant\n',
				'Assistant:',
				'Assistant\n'
			];

			// Try to find and remove any assistant prefix
			for (const prefix of assistantPrefixes) {
				if (cleanedText.includes(prefix)) {
					cleanedText = cleanedText.split(prefix).pop() || cleanedText;
					break;
				}
			}

			// Remove any end markers
			cleanedText = cleanedText.replace(/<\|im_end\|>/g, '').trim();

			// Remove any surrounding quotes
			cleanedText = cleanedText.replace(/^["']|["']$/g, '');

			translatedText = cleanedText;
			characterMood = Math.random() > 0.8 ? 'confused' : 'happy';
		} catch (err) {
			console.error('Translation error:', err);
			errorMessage = 'Oopsie! Translation got a bit too awkward. Try again?';
			characterMood = 'confused';
		} finally {
			isTranslating = false;
		}
	}

	// Clear both text fields
	function clearText() {
		sourceText = '';
		translatedText = '';
		characterMood = 'neutral';
	}

	// Handle language change
	function handleLanguageChange(lang: string) {
		selectedLanguage = lang;
		if (sourceText.trim() && translatedText.trim()) {
			// If we already have text, automatically translate
			translateText();
		}
	}

	// Initialize on component mount
	onMount(() => {
		if (!isModelLoaded && !isLoading) {
			loadModel();
		}
	});
</script>

<svelte:head>
	<title>Awkward Translator</title>
</svelte:head>

<div class="translator-container">
	{#if !isModelLoaded}
		<ModelLoader {isLoading} {downloadError} {downloadProgress} {previousProgress} {loadModel} />
	{:else}
		<div class="translator-interface">
			<h1>✨ Awkward Translator ✨</h1>
			<p class="subtitle">Sometimes right, always confident!</p>

			<QuirkyCharacter mood={characterMood} {confidenceLevel} />

			<div class="translation-grid">
				<TranslationBox
					label="Your Text"
					bind:text={sourceText}
					disabled={isTranslating}
					placeholder="Type something here to translate..."
				/>

				<div class="controls-container">
					<LanguageSelector
						{languages}
						{selectedLanguage}
						onChange={handleLanguageChange}
						disabled={isTranslating}
					/>

					<div class="action-buttons">
						<button
							class="translate-btn"
							onclick={translateText}
							disabled={isTranslating || !sourceText.trim()}
						>
							{#if isTranslating}
								<div class="loading-dots">
									<span></span><span></span><span></span>
								</div>
							{:else}
								Translate!
							{/if}
						</button>

						<button
							class="clear-btn"
							onclick={clearText}
							disabled={isTranslating || (!sourceText.trim() && !translatedText.trim())}
						>
							Clear
						</button>
					</div>
				</div>

				<TranslationBox
					label={`${selectedLanguage} (maybe?)`}
					bind:text={translatedText}
					disabled={true}
					placeholder="Translation will appear here..."
				/>
			</div>

			{#if errorMessage}
				<div class="error-message">{errorMessage}</div>
			{/if}

			<div class="translator-note">
				<p>
					This translator is powered by a small local AI model running in your browser - expect
					charming quirks!
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Global and container styles */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			'Nunito',
			'Segoe UI',
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;
		background-color: #fef6e6;
		height: 100vh;
		width: 100vw;
		overflow-x: hidden;
	}

	.translator-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		width: 100%;
		padding: 2rem;
		box-sizing: border-box;
		background-image:
			linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6)),
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffb6b9' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, #fef6e6, #ffebcd);
		background-size:
			cover,
			300px 300px,
			100% 100%;
		background-attachment: fixed;
	}

	h1 {
		font-family: 'Nunito', 'Comic Sans MS', cursive, sans-serif;
		color: #ef6f6c;
		text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
		text-align: center;
		font-size: 2.2rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.subtitle {
		text-align: center;
		font-size: 1.1rem;
		margin-top: 0;
		margin-bottom: 1.5rem;
		color: #888;
		font-style: italic;
	}

	.translator-interface {
		width: 100%;
		max-width: 900px;
		background-color: rgba(255, 255, 255, 0.95);
		border-radius: 20px;
		box-shadow: 0 8px 32px rgba(239, 111, 108, 0.2);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		border: 5px solid #ef6f6c;
	}

	.translation-grid {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto auto auto;
		gap: 1.5rem;
		width: 100%;
	}

	.controls-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: rgba(255, 235, 205, 0.5);
		border-radius: 12px;
		border: 2px dashed #efb1b0;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.translate-btn,
	.clear-btn {
		padding: 0.8rem 1.5rem;
		border-radius: 12px;
		font-family: 'Nunito', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
	}

	.translate-btn {
		background-color: #ef6f6c;
		color: white;
		box-shadow: 0 4px 8px rgba(239, 111, 108, 0.3);
		min-width: 120px;
	}

	.translate-btn:hover:not(:disabled) {
		background-color: #e85f5c;
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(239, 111, 108, 0.4);
	}

	.translate-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.clear-btn {
		background-color: #f3f3f3;
		color: #666;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.clear-btn:hover:not(:disabled) {
		background-color: #e6e6e6;
		transform: translateY(-2px);
	}

	.translate-btn:disabled,
	.clear-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-message {
		color: #ef6f6c;
		font-size: 0.95rem;
		text-align: center;
		background-color: #ffeaea;
		padding: 0.7rem 1rem;
		border-radius: 10px;
		border: 1px solid #ffcdcd;
		width: 100%;
		max-width: 500px;
	}

	.translator-note {
		margin-top: 1rem;
		font-size: 0.9rem;
		color: #888;
		text-align: center;
		font-style: italic;
		max-width: 700px;
	}

	/* Loading Animation */
	.loading-dots {
		display: flex;
		gap: 4px;
		align-items: center;
		justify-content: center;
	}

	.loading-dots span {
		width: 8px;
		height: 8px;
		background-color: white;
		border-radius: 50%;
		display: inline-block;
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.loading-dots span:nth-child(1) {
		animation-delay: -0.32s;
	}

	.loading-dots span:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}

	/* Responsive styles */
	@media (min-width: 768px) {
		.translation-grid {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto auto;
		}

		.controls-container {
			grid-column: 1 / span 2;
			grid-row: 1;
			flex-direction: row;
			justify-content: space-between;
		}
	}

	@media (max-width: 950px) {
		.translator-interface {
			max-width: 95%;
			padding: 1.5rem;
		}
	}

	@media (max-width: 768px) {
		.translator-container {
			padding: 1rem;
		}

		h1 {
			font-size: 1.8rem;
		}

		.action-buttons {
			width: 100%;
			justify-content: center;
		}
	}
</style>
