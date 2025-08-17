import { BASE_MODEL_URL } from '$lib/config.js';
import * as ort from 'onnxruntime-web';
import { cachedFetch } from './model-cache.js';
import { phonemize } from 'phonemizer';
import { RawAudio } from './utils.js';

// Kokoro TTS class for local model
export class KokoroTTS {
	voices: any[];
	session: any;
	voiceEmbeddings: Record<string, Float32Array>;
	tokenizer: any;
	modelBuffer: ArrayBuffer | undefined;
	wasmSession: any;

	constructor(
		voices?: any[],
		session?: any,
		voiceEmbeddings?: Record<string, Float32Array>,
		tokenizer?: any,
		modelBuffer?: ArrayBuffer
	) {
		this.voices = voices || [];
		this.session = session;
		this.voiceEmbeddings = voiceEmbeddings || {};
		this.tokenizer = tokenizer;
		this.modelBuffer = modelBuffer;
		this.wasmSession = null; // Fallback WASM session
	}

	static async from_pretrained(
		model_path: string,
		options: Record<string, any> = {}
	): Promise<KokoroTTS> {
		try {
			// Use imported ONNX Runtime Web and caching utility

			// Use ONNX Runtime Web files from npm package in static directory
			ort.env.wasm.wasmPaths = '/onnx-runtime/';

			// Load model and tokenizer
			const [modelResponse, tokenizerResponse] = await Promise.all([
				cachedFetch(model_path),
				cachedFetch(BASE_MODEL_URL + '/tts-models/kokoro/tokenizer.json')
			]);

			const [modelBuffer, tokenizer] = await Promise.all([
				modelResponse.arrayBuffer(),
				tokenizerResponse.json()
			]);

			// Try WebGPU with better configuration, fallback to WASM
			let session;
			try {
				if (options.device === 'webgpu') {
					// Try WebGPU with specific settings for better compatibility
					session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
						executionProviders: [
							{
								name: 'webgpu',
								deviceType: 'gpu',
								powerPreference: 'high-performance',
								preferredLayout: 'NCHW',
								// Try to improve precision for better audio quality
								context: {
									preferredChannelsLast: false,
									enableDebugLogs: false
								}
							} as any,
							'wasm' // Keep WASM as fallback
						],
						// Global session options that might help with precision
						graphOptimizationLevel: 'basic', // Less aggressive optimization
						enableProfiling: false
					});
				} else {
					throw new Error('Using WASM as requested');
				}
			} catch {
				// Fallback to WASM with explicit configuration
				session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
					executionProviders: [
						{
							name: 'wasm',
							simd: true
						} as any
					]
				});
			}

			// Load voice embeddings from .bin files
			const voiceEmbeddings = {};
			const voiceFiles = [
				'af',
				'af_alloy',
				'af_aoede',
				'af_bella',
				'af_heart',
				'af_jessica',
				'af_kore',
				'af_nicole',
				'af_nova',
				'af_river',
				'af_sarah',
				'af_sky',
				'am_adam',
				'am_echo',
				'am_eric',
				'am_fenrir',
				'am_liam',
				'am_michael',
				'am_onyx',
				'am_puck',
				'am_santa'
			];

			// Load voice embeddings in parallel
			const voicePromises = voiceFiles.map(async (voice) => {
				try {
					const voiceResponse = await cachedFetch(
						`${BASE_MODEL_URL}/tts-models/kokoro/voices/${voice}.bin`
					);
					const arrayBuffer = await voiceResponse.arrayBuffer();
					// Convert binary data to Float32Array (assuming 32-bit floats)
					const fullArray = new Float32Array(arrayBuffer);

					// Keep the full voice embedding data - we'll slice it based on token count later
					voiceEmbeddings[voice] = fullArray;
				} catch (error) {
					console.warn(`Could not load voice ${voice}:`, error);
				}
			});

			await Promise.allSettled(voicePromises);

			// Transform the voice data into the format we need
			const voices = voiceFiles
				.filter((voice) => voiceEmbeddings[voice]) // Only include successfully loaded voices
				.map((voice) => {
					const prefix = voice.match(/^(af|am)/)?.[1];
					const gender = prefix === 'af' ? 'Female' : 'Male';
					const baseName = voice.replace(/^(af|am)_?/, '');

					return {
						id: voice,
						name: baseName
							? `${baseName.charAt(0).toUpperCase() + baseName.slice(1)} (${gender})`
							: gender
					};
				});

			return new KokoroTTS(voices, session, voiceEmbeddings, tokenizer, modelBuffer);
		} catch (error) {
			console.error('Error loading Kokoro model:', error);
			// Fallback to default voices without model
			return new KokoroTTS();
		}
	}

	// Import and use the proper phonemization function
	async phonemize(text: string, language: string = 'a'): Promise<string> {
		try {
			// Use imported phonemizer package with proper normalization

			// Normalize text like the reference implementation
			const normalizedText = text
				.replace(/['']/g, "'")
				.replace(/[""]/g, '"')
				.replace(/\(/g, '«')
				.replace(/\)/g, '»')
				.replace(/\betc\.(?! [A-Z])/gi, 'etc')
				.trim();

			// Use phonemizer with the appropriate language
			const lang = language === 'a' ? 'en-us' : 'en';
			const result = await phonemize(normalizedText, lang);

			// Join phoneme arrays if necessary
			const phonemeString = Array.isArray(result) ? result.join(' ') : result;

			// Apply post-processing like the reference
			return phonemeString
				.replace(/ʲ/g, 'j')
				.replace(/r/g, 'ɹ')
				.replace(/x/g, 'k')
				.replace(/ɬ/g, 'l')
				.trim();
		} catch (error) {
			console.error('Phonemization failed:', error);
			throw new Error(
				`Phonemization failed: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	// Use the tokenizer properly like the reference implementation
	async tokenizeText(text: string, language: string = 'a'): Promise<number[]> {
		if (!this.tokenizer) {
			throw new Error('Tokenizer not loaded');
		}

		// Get phonemes using proper phonemization
		const phonemes = await this.phonemize(text, language);

		// Use the tokenizer's encode method (simulated)
		// The tokenizer adds boundary tokens automatically
		const tokens = phonemes.split('').map((char) => {
			const vocab = this.tokenizer.model?.vocab || {};
			const tokenId = vocab[char];
			if (tokenId !== undefined) {
				return tokenId;
			}
			// For unknown characters, use the boundary token
			return 0; // $ token
		});

		// Add start and end tokens manually to match reference behavior
		return [0, ...tokens, 0];
	}

	async *stream(
		textStreamer: AsyncIterable<string>,
		options: Record<string, any> = {}
	): AsyncGenerator<{ text: string; phonemes: string; audio: RawAudio }, void, unknown> {
		const { voice = 'af_heart', speed = 1.0 } = options;

		// Process the text stream
		for await (const text of textStreamer) {
			if (text.trim()) {
				try {
					if (this.session && this.voiceEmbeddings[voice]) {
						try {
							const language = voice.startsWith('a') ? 'a' : 'b'; // Determine language from voice ID

							// Get phonemes for the text chunk
							const phonemes = await this.phonemize(text, language);

							const tokenIds = await this.tokenizeText(text, language);
							const inputIds = new BigInt64Array(tokenIds.map((id) => BigInt(id)));

							// Select voice style based on number of input tokens (like reference implementation)
							const numTokens = Math.min(Math.max(tokenIds.length - 2, 0), 509);
							const STYLE_DIM = 256;
							const fullVoiceData = this.voiceEmbeddings[voice];
							const offset = numTokens * STYLE_DIM;
							const speakerEmbedding = fullVoiceData.slice(offset, offset + STYLE_DIM);

							const inputs = {
								input_ids: new ort.Tensor('int64', inputIds, [1, inputIds.length]),
								style: new ort.Tensor('float32', speakerEmbedding, [1, speakerEmbedding.length]),
								speed: new ort.Tensor('float32', new Float32Array([1.0 / speed]), [1])
							};

							let results = await this.session.run(inputs);

							// Extract audio data - assuming output is called 'waveform' or 'output'
							let audioOutput = results.waveform || results.output;
							let audioData = audioOutput.data;

							// Check if WebGPU produced NaN values and fallback to WASM
							if (audioData.length > 0 && isNaN(audioData[0])) {
								// Create WASM session if we don't have one
								if (!this.wasmSession && this.modelBuffer) {
									this.wasmSession = await ort.InferenceSession.create(
										new Uint8Array(this.modelBuffer),
										{
											executionProviders: ['wasm']
										}
									);
								}

								// Retry inference with WASM
								results = await this.wasmSession.run(inputs);
								audioOutput = results.waveform || results.output;
								audioData = audioOutput.data;
							}

							// Use the correct sample rate - Kokoro typically outputs 24kHz
							const sampleRate = 24000;

							// Don't apply additional speed adjustment since we already handled it in the model input
							const finalAudioData = new Float32Array(audioData);

							// Clean up NaN values and normalize
							let maxAmplitude = 0;
							for (let i = 0; i < finalAudioData.length; i++) {
								if (isNaN(finalAudioData[i])) {
									finalAudioData[i] = 0; // Replace NaN with silence
								} else {
									maxAmplitude = Math.max(maxAmplitude, Math.abs(finalAudioData[i]));
								}
							}

							// Gentle normalization to prevent "going in and out" effect
							if (maxAmplitude > 0) {
								// Only normalize if the audio is very quiet (< 0.05) or very loud (> 0.95)
								let normalizationFactor = 1.0;
								if (maxAmplitude < 0.05) {
									normalizationFactor = 0.3 / maxAmplitude; // Boost quiet audio moderately
								} else if (maxAmplitude > 0.95) {
									normalizationFactor = 0.8 / maxAmplitude; // Reduce loud audio slightly
								}

								if (normalizationFactor !== 1.0) {
									for (let i = 0; i < finalAudioData.length; i++) {
										finalAudioData[i] *= normalizationFactor;
									}
								}
							}

							// Yield with phonemes information like the official implementation
							yield {
								text,
								phonemes, // Include phonemes in the output
								audio: new RawAudio(finalAudioData, sampleRate)
							};
						} catch (modelError) {
							console.error('Model inference error:', modelError);
							console.error(
								'Error details:',
								modelError instanceof Error ? modelError.message : String(modelError)
							);
						}
					}
				} catch (error) {
					console.error('Error generating audio:', error);
					// Yield silence in case of error
					yield {
						text,
						phonemes: text, // Fallback phonemes
						audio: new RawAudio(new Float32Array(24000), 24000)
					};
				}
			}
		}
	}
}
