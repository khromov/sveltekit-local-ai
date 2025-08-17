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

	close() {
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

// Piper TTS class for local model
export class PiperTTS {
	voiceConfig: any;
	session: any;
	phonemeIdMap: any;

	constructor(voiceConfig: any = null, session: any = null) {
		this.voiceConfig = voiceConfig;
		this.session = session;
		this.phonemeIdMap = null;
	}

	static async from_pretrained(modelPath: string, configPath: string): Promise<PiperTTS> {
		try {
			// Use imported ONNX Runtime Web and caching utility

			// Use ONNX Runtime Web files from npm package in static directory
			ort.env.wasm.wasmPaths = '/onnx-runtime/';

			// Load model and config
			const [modelResponse, configResponse] = await Promise.all([
				cachedFetch(modelPath),
				cachedFetch(configPath)
			]);

			const [modelBuffer, voiceConfig] = await Promise.all([
				modelResponse.arrayBuffer(),
				configResponse.json()
			]);

			// Create ONNX session with WASM execution provider
			const session = await ort.InferenceSession.create(new Uint8Array(modelBuffer), {
				executionProviders: ['wasm']
			});

			return new PiperTTS(voiceConfig, session);
		} catch (error) {
			console.error('Error loading Piper model:', error);
			throw error;
		}
	}

	// Convert text to phonemes using the phonemizer package
	async textToPhonemes(text: string): Promise<string[][]> {
		if (this.voiceConfig.phoneme_type === 'text') {
			// Text phonemes - just return normalized characters
			return [Array.from(text.normalize('NFD'))];
		}

		// Use phonemizer for espeak-style phonemes
		const voice = this.voiceConfig.espeak?.voice || 'en-us';
		const phonemes = await phonemize(text, voice);

		// Handle different return types from phonemizer
		let phonemeText: string;
		if (typeof phonemes === 'string') {
			phonemeText = phonemes;
		} else if (Array.isArray(phonemes)) {
			// Join the array elements - each element is a phonemized sentence
			phonemeText = phonemes.join(' ');
		} else if (phonemes && typeof phonemes === 'object') {
			// If it's an object, try to extract text property or convert to string
			const phonemeObj = phonemes as Record<string, unknown>;
			phonemeText =
				(phonemeObj.text as string) || (phonemeObj.phonemes as string) || String(phonemes);
		} else {
			console.warn('Unexpected phonemes format:', phonemes);
			phonemeText = String(phonemes || text);
		}

		// Split into sentences and convert to character arrays
		const sentences = phonemeText.split(/[.!?]+/).filter((s: string) => s.trim());
		return sentences.map((sentence: string) => Array.from(sentence.trim().normalize('NFD')));
	}

	// Convert phonemes to IDs using the phoneme ID map
	phonemesToIds(textPhonemes: string[][]): number[] {
		if (!this.voiceConfig || !this.voiceConfig.phoneme_id_map) {
			throw new Error('Phoneme ID map not available');
		}

		const idMap = this.voiceConfig.phoneme_id_map;
		const BOS = '^';
		const EOS = '$';
		const PAD = '_';

		const phonemeIds: number[] = [];

		for (const sentencePhonemes of textPhonemes) {
			phonemeIds.push(idMap[BOS] as number);
			phonemeIds.push(idMap[PAD] as number);

			for (const phoneme of sentencePhonemes) {
				if (phoneme in idMap) {
					phonemeIds.push(idMap[phoneme] as number);
					phonemeIds.push(idMap[PAD] as number);
				}
			}

			phonemeIds.push(idMap[EOS] as number);
		}

		return phonemeIds;
	}

	async *stream(
		textStreamer: AsyncIterable<string>,
		options: {
			speakerId?: number;
			lengthScale?: number;
			noiseScale?: number;
			noiseWScale?: number;
		} = {}
	): AsyncGenerator<{ text: string; audio: RawAudio }, void, unknown> {
		const { speakerId = 0, lengthScale = 1.0, noiseScale = 0.667, noiseWScale = 0.8 } = options;

		// Process the text stream
		for await (const text of textStreamer) {
			if (text.trim()) {
				try {
					if (this.session && this.voiceConfig) {
						// Convert text to phonemes then to IDs
						const textPhonemes = await this.textToPhonemes(text);
						const phonemeIds = this.phonemesToIds(textPhonemes);

						// Prepare tensors for Piper model

						const inputs = {
							input: new ort.Tensor(
								'int64',
								new BigInt64Array(phonemeIds.map((id) => BigInt(id))),
								[1, phonemeIds.length]
							),
							input_lengths: new ort.Tensor(
								'int64',
								BigInt64Array.from([BigInt(phonemeIds.length)]),
								[1]
							),
							scales: new ort.Tensor(
								'float32',
								Float32Array.from([noiseScale, lengthScale, noiseWScale]),
								[3]
							)
						};

						// Add speaker ID for multi-speaker models
						if (this.voiceConfig.num_speakers > 1) {
							inputs['sid'] = new ort.Tensor('int64', BigInt64Array.from([BigInt(speakerId)]), [1]);
						}

						const results = await this.session.run(inputs);

						// Extract audio data
						const audioOutput = results.output;
						const audioData = audioOutput.data;

						// Use the sample rate from config
						const sampleRate = this.voiceConfig.audio.sample_rate;

						// Clean up audio data
						const finalAudioData = new Float32Array(audioData);

						yield {
							text,
							audio: new RawAudio(finalAudioData, sampleRate)
						};
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

	// Get available speakers for multi-speaker models
	getSpeakers() {
		if (!this.voiceConfig || this.voiceConfig.num_speakers <= 1) {
			return [{ id: 0, name: 'Voice 1' }];
		}

		const speakerIdMap = this.voiceConfig.speaker_id_map || {};
		return Object.entries(speakerIdMap)
			.sort(([, a], [, b]) => (a as number) - (b as number)) // Sort by speaker ID (0, 1, 2, ...)
			.map(([originalId, id]) => ({
				id: id as number,
				name: `Voice ${(id as number) + 1}`,
				originalId
			}));
	}
}
