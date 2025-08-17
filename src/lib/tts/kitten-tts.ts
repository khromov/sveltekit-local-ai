import { BASE_MODEL_URL } from '$lib/config.js';
import { cleanTextForTTS, chunkText } from './text-cleaner.js';
import * as ort from 'onnxruntime-web';
import { cachedFetch } from './model-cache.js';
import { phonemize } from 'phonemizer';
// Text splitting stream to break text into chunks
export class TextSplitterStream {
	chunks: string[];
	closed: boolean;

	constructor() {
		this.chunks = [];
		this.closed = false;
	}

	chunkText(text: string): string[] | null {
		// Clean the text first, then chunk it
		const cleanedText = cleanTextForTTS(text);
		return chunkText(cleanedText);
	}

	push(text: string): void {
		// Simple sentence splitting for now
		const sentences = this.chunkText(text) || [text];
		this.chunks.push(...sentences);
	}

	close(): void {
		this.closed = true;
	}

	async *[Symbol.asyncIterator]() {
		for (const chunk of this.chunks) {
			yield chunk;
		}
	}
}

// RawAudio class to handle audio data
export class RawAudio {
	audio: Float32Array;
	sampling_rate: number;

	constructor(audio: Float32Array, sampling_rate: number) {
		this.audio = audio;
		this.sampling_rate = sampling_rate;
	}

	get length() {
		return this.audio.length;
	}

	toBlob() {
		// Convert Float32Array to WAV blob
		const buffer = this.encodeWAV(this.audio, this.sampling_rate);
		return new Blob([buffer], { type: 'audio/wav' });
	}

	encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
		const buffer = new ArrayBuffer(44 + samples.length * 2);
		const view = new DataView(buffer);

		// RIFF identifier
		this.writeString(view, 0, 'RIFF');
		// file length
		view.setUint32(4, 36 + samples.length * 2, true);
		// RIFF type
		this.writeString(view, 8, 'WAVE');
		// format chunk identifier
		this.writeString(view, 12, 'fmt ');
		// format chunk length
		view.setUint32(16, 16, true);
		// sample format (raw)
		view.setUint16(20, 1, true);
		// channel count
		view.setUint16(22, 1, true);
		// sample rate
		view.setUint32(24, sampleRate, true);
		// byte rate (sample rate * block align)
		view.setUint32(28, sampleRate * 2, true);
		// block align (channel count * bytes per sample)
		view.setUint16(32, 2, true);
		// bits per sample
		view.setUint16(34, 16, true);
		// data chunk identifier
		this.writeString(view, 36, 'data');
		// data chunk length
		view.setUint32(40, samples.length * 2, true);

		this.floatTo16BitPCM(view, 44, samples);

		return buffer;
	}

	writeString(view: DataView, offset: number, string: string): void {
		for (let i = 0; i < string.length; i++) {
			view.setUint8(offset + i, string.charCodeAt(i));
		}
	}

	floatTo16BitPCM(output: DataView, offset: number, input: Float32Array): void {
		for (let i = 0; i < input.length; i++, offset += 2) {
			const s = Math.max(-1, Math.min(1, input[i]));
			output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
		}
	}
}

// KittenTTS class for local model
export class KittenTTS {
	voices: any[];
	session: any;
	voiceEmbeddings: Record<string, any>;
	wasmSession: any;
	tokenizer: any;
	vocab: Record<string, number> = {};
	vocabArray: string[] = [];

	constructor(voices?: any[], session?: any, voiceEmbeddings?: Record<string, any>) {
		this.voices = voices || [];
		this.session = session;
		this.voiceEmbeddings = voiceEmbeddings || {};
		this.wasmSession = null; // Fallback WASM session
	}

	static async from_pretrained(
		model_path: string,
		options: Record<string, any> = {}
	): Promise<KittenTTS> {
		try {
			// Use imported ONNX Runtime Web and caching utility

			// Use ONNX Runtime Web files from npm package in static directory
			ort.env.wasm.wasmPaths = '/onnx-runtime/';

			// Load model using cached fetch
			const modelResponse = await cachedFetch(model_path);
			const modelBuffer = await modelResponse.arrayBuffer();

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
			} catch (webgpuError) {
				console.warn('WebGPU failed, falling back to WASM:', webgpuError);
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

			// Load voices from the local voices.json file (also cached)
			const voicesResponse = await cachedFetch(
				BASE_MODEL_URL + '/tts-models/kitten-tts/voices.json'
			);
			const voicesData = await voicesResponse.json();

			// Transform the voices data into the format we need
			const voices = Object.keys(voicesData).map((key) => ({
				id: key,
				name: key
					.replace('expr-', '')
					.replace(/-/g, ' ')
					.replace(/\b\w/g, (l) => l.toUpperCase())
					.replace('M', 'Male')
					.replace('F', 'Female')
			}));

			return new KittenTTS(voices, session, voicesData);
		} catch (error) {
			console.error('Error loading local model:', error);
			// Fallback to default voices without model
			return new KittenTTS();
		}
	}

	// Load the tokenizer
	async loadTokenizer(): Promise<void> {
		if (!this.tokenizer) {
			try {
				const response = await cachedFetch(
					BASE_MODEL_URL + '/tts-models/kitten-tts/tokenizer.json'
				);
				const tokenizerData = await response.json();

				// Extract the actual vocabulary from the tokenizer
				this.vocab = tokenizerData.model.vocab;
				this.vocabArray = [];

				// Create reverse mapping
				for (const [char, id] of Object.entries(this.vocab)) {
					this.vocabArray[id] = char;
				}

				this.tokenizer = tokenizerData;
			} catch (error) {
				console.error('Error loading tokenizer:', error);
				this.vocab = {};
				this.vocabArray = [];
			}
		}
	}

	// Convert text to phonemes using the phonemizer package
	async textToPhonemes(text: string): Promise<string> {
		try {
			const result = await phonemize(text, 'en-us');
			return Array.isArray(result) ? result.join(' ') : result;
		} catch (error) {
			console.error('Phonemization failed:', error);
			throw new Error(
				`Phonemization failed: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	// Tokenize text using the loaded tokenizer
	async tokenizeText(text: string): Promise<number[]> {
		await this.loadTokenizer();

		const phonemes = await this.textToPhonemes(text);
		const tokensWithBoundaries = `$${phonemes}$`;

		// Convert to token IDs
		const tokens = tokensWithBoundaries.split('').map((char) => {
			const tokenId = this.vocab[char];
			if (tokenId === undefined) {
				console.warn(`Unknown character: "${char}", using $ token`);
				return 0; // Use $ token for unknown chars
			}
			return tokenId;
		});

		return tokens;
	}

	async *stream(
		textStreamer: AsyncIterable<string>,
		options: Record<string, any> = {}
	): AsyncGenerator<{ text: string; audio: RawAudio }, void, unknown> {
		const { voice = 'expr-voice-2-m', speed = 1.0 } = options;

		// Process the text stream
		for await (const text of textStreamer) {
			if (text.trim()) {
				try {
					if (this.session && this.voiceEmbeddings[voice]) {
						try {
							const tokenIds = await this.tokenizeText(text);
							const inputIds = new BigInt64Array(tokenIds.map((id) => BigInt(id)));
							const speakerEmbedding = new Float32Array(this.voiceEmbeddings[voice][0]);

							const inputs = {
								input_ids: new ort.Tensor('int64', inputIds, [1, inputIds.length]),
								style: new ort.Tensor('float32', speakerEmbedding, [1, speakerEmbedding.length]),
								speed: new ort.Tensor('float32', new Float32Array([speed]), [1])
							};

							let results = await this.session.run(inputs);

							// Extract audio data - we know it's called 'waveform'
							let audioOutput = results.waveform;
							let audioData = audioOutput.data;

							// Check if WebGPU produced NaN values and fallback to WASM
							if (audioData.length > 0 && isNaN(audioData[0])) {
								// Create WASM session if we don't have one
								if (!this.wasmSession) {
									this.wasmSession = await ort.InferenceSession.create(
										BASE_MODEL_URL + '/tts-models/kitten-tts/model_quantized.onnx',
										{
											executionProviders: ['wasm']
										}
									);
								}

								// Retry inference with WASM
								results = await this.wasmSession.run(inputs);
								audioOutput = results.waveform;
								audioData = audioOutput.data;
							}

							// Use the correct sample rate based on our calculation
							const sampleRate = 24000; // Model generates 24kHz audio

							// Find min/max without causing stack overflow
							let min = audioData[0],
								max = audioData[0];
							for (let i = 1; i < audioData.length; i++) {
								if (audioData[i] < min) min = audioData[i];
								if (audioData[i] > max) max = audioData[i];
							}

							// Apply speed adjustment
							let finalAudioData = new Float32Array(audioData);
							if (speed !== 1.0) {
								// Simple time-stretching by resampling
								const newLength = Math.floor(audioData.length / speed);
								finalAudioData = new Float32Array(newLength);
								for (let i = 0; i < newLength; i++) {
									const srcIndex = Math.floor(i * speed);
									finalAudioData[i] = audioData[Math.min(srcIndex, audioData.length - 1)];
								}
							}

							// Clean up NaN values and normalize
							let maxAmplitude = 0;
							for (let i = 0; i < finalAudioData.length; i++) {
								if (isNaN(finalAudioData[i])) {
									finalAudioData[i] = 0; // Replace NaN with silence
								} else {
									maxAmplitude = Math.max(maxAmplitude, Math.abs(finalAudioData[i]));
								}
							}

							// Normalize audio if it's too quiet
							if (maxAmplitude > 0 && maxAmplitude < 0.1) {
								const normalizationFactor = 0.5 / maxAmplitude;

								for (let i = 0; i < finalAudioData.length; i++) {
									finalAudioData[i] *= normalizationFactor;
								}
							}

							yield {
								text,
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
						audio: new RawAudio(new Float32Array(22050), 22050)
					};
				}
			}
		}
	}
}
