import { KittenTTS, TextSplitterStream as KittenTextSplitterStream } from '../tts/kitten-tts';
import { PiperTTS, TextSplitterStream as PiperTextSplitterStream } from '../tts/piper-tts';
import { KokoroTTS, TextSplitterStream as KokoroTextSplitterStream } from '../tts/kokoro-tts';
import { detectWebGPU } from '../utils.js';
import { BASE_MODEL_URL } from '$lib/config.js';

let tts: KittenTTS | PiperTTS | KokoroTTS | null = null;
let device = 'wasm';
let currentModel: string | null = null;

// Initialize the model
async function initializeModel(modelType: string, useWebGPU = false): Promise<void> {
	try {
		currentModel = modelType;

		if (modelType === 'kitten') {
			// Device detection for Kitten model (supports WebGPU)
			const webGPUSupported = await detectWebGPU();
			device = useWebGPU && webGPUSupported ? 'webgpu' : 'wasm';

			self.postMessage({ status: 'device', device });

			// Load the Kitten model
			const model_path = BASE_MODEL_URL + '/tts-models/kitten-tts/model_quantized.onnx';
			tts = await KittenTTS.from_pretrained(model_path, {
				dtype: 'q8',
				device
			});

			self.postMessage({ status: 'ready', voices: tts.voices, device });
		} else if (modelType === 'piper') {
			// Piper uses WASM only
			device = 'wasm';
			self.postMessage({ status: 'device', device });

			// Load the Piper model
			const model_path = BASE_MODEL_URL + '/tts-models/piper/en_US-libritts_r-medium.onnx';
			const config_path = BASE_MODEL_URL + '/tts-models/piper/en_US-libritts_r-medium.onnx.json';
			tts = await PiperTTS.from_pretrained(model_path, config_path);

			// Get speakers for Piper model
			const voices = tts.getSpeakers();
			self.postMessage({ status: 'ready', voices, device });
		} else if (modelType === 'kokoro') {
			// Device detection for Kokoro model (supports WebGPU)
			const webGPUSupported = await detectWebGPU();
			device = useWebGPU && webGPUSupported ? 'webgpu' : 'wasm';

			self.postMessage({ status: 'device', device });

			// Load the Kokoro model
			const model_path = BASE_MODEL_URL + '/tts-models/kokoro/model_quantized.onnx';
			tts = await KokoroTTS.from_pretrained(model_path, {
				dtype: device === 'wasm' ? 'q8' : 'fp32',
				device
			});

			self.postMessage({ status: 'ready', voices: tts.voices, device });
		} else {
			throw new Error(`Unknown model type: ${modelType}`);
		}
	} catch (e) {
		console.error('Error loading model:', e);
		self.postMessage({ status: 'error', data: e instanceof Error ? e.message : String(e) });
	}
}

// Listen for messages from the main thread
self.addEventListener('message', async (e: MessageEvent) => {
	const {
		type,
		model,
		useWebGPU,
		text,
		voice,
		speed,
		sampleRate = 24000,
		isPreview
	}: {
		type: string;
		model: string;
		useWebGPU: boolean;
		text: string;
		voice: string | number;
		speed: number;
		sampleRate: number;
		isPreview: boolean;
	} = e.data;

	// Handle initialization
	if (type === 'init') {
		await initializeModel(model, useWebGPU);
		return;
	}

	// Handle TTS generation
	if (type === 'tts') {
		if (!tts) {
			self.postMessage({ status: 'error', data: 'Model not initialized' });
			return;
		}

		// Use the correct TextSplitterStream based on current model
		const TextSplitterStream =
			currentModel === 'kitten'
				? KittenTextSplitterStream
				: currentModel === 'kokoro'
					? KokoroTextSplitterStream
					: PiperTextSplitterStream;
		const streamer = new TextSplitterStream();

		streamer.push(text);
		streamer.close(); // Indicate we won't add more text

		// Use different options based on the model
		const streamOptions =
			currentModel === 'kitten'
				? { voice, speed }
				: currentModel === 'kokoro'
					? { voice, speed }
					: {
							speakerId: typeof voice === 'string' ? parseInt(voice) : voice,
							lengthScale: 1.0 / speed
						}; // Piper uses speakerId and lengthScale

		const stream = tts.stream(streamer, streamOptions);
		const chunks: any[] = [];

		try {
			for await (const { text, audio } of stream as any) {
				if (!isPreview) {
					self.postMessage({
						status: 'stream',
						chunk: {
							audio: audio.toBlob(),
							text
						}
					});
				}
				chunks.push(audio as any);
			}
		} catch (error) {
			console.error('Error during streaming:', error);
			self.postMessage({
				status: 'error',
				data: error instanceof Error ? error.message : String(error)
			});
			return;
		}

		// Merge chunks
		let audio;
		if (chunks.length > 0) {
			try {
				const originalSamplingRate = (chunks[0] as any).sampling_rate;
				const length = chunks.reduce((sum, chunk) => sum + (chunk as any).audio.length, 0);
				let waveform = new Float32Array(length);
				let offset = 0;
				for (const chunk of chunks) {
					const { audio } = chunk as any;
					waveform.set(audio, offset);
					offset += audio.length;
				}

				// Normalize peaks & trim silence
				normalizePeak(waveform, 0.9);
				waveform = trimSilence(waveform, 0.002, Math.floor(originalSamplingRate * 0.02)); // 20ms padding

				// Resample if needed (only for Kitten and Kokoro models)
				const targetSampleRate =
					currentModel === 'kitten' || currentModel === 'kokoro'
						? sampleRate
						: originalSamplingRate;

				if (
					(currentModel === 'kitten' || currentModel === 'kokoro') &&
					targetSampleRate !== originalSamplingRate
				) {
					// Apply anti-aliasing filter for downsampling
					if (targetSampleRate < originalSamplingRate) {
						waveform = antiAliasFilter(waveform, originalSamplingRate, targetSampleRate);
					}

					waveform = resampleLinear(waveform, originalSamplingRate, targetSampleRate);
				}

				// Create a new merged RawAudio with the target sample rate
				audio = new (chunks[0] as any).constructor(waveform, targetSampleRate);
			} catch (error) {
				console.error('Error processing audio chunks:', error);
				self.postMessage({
					status: 'error',
					data: error instanceof Error ? error.message : String(error)
				});
				return;
			}
		}

		self.postMessage({ status: 'complete', audio: audio?.toBlob() });
	}
});

function normalizePeak(f32, target = 0.9) {
	if (!f32?.length) return;
	let max = 1e-9;
	for (let i = 0; i < f32.length; i++) max = Math.max(max, Math.abs(f32[i]));
	const g = Math.min(4, target / max);
	if (g < 1) {
		for (let i = 0; i < f32.length; i++) f32[i] *= g;
	}
}

function trimSilence(f32, thresh = 0.002, minSamples = 480) {
	let s = 0,
		e = f32.length - 1;
	while (s < e && Math.abs(f32[s]) < thresh) s++;
	while (e > s && Math.abs(f32[e]) < thresh) e--;
	s = Math.max(0, s - minSamples);
	e = Math.min(f32.length, e + minSamples);
	return f32.slice(s, e);
}

function antiAliasFilter(input, inRate, outRate) {
	// Simple low-pass filter to prevent aliasing during downsampling
	const cutoff = Math.min(outRate / 2, inRate / 2) * 0.9; // 90% of Nyquist frequency
	const nyquist = inRate / 2;
	const normalizedCutoff = cutoff / nyquist;

	// Simple IIR low-pass filter (Butterworth-like)
	const a = Math.exp(-2 * Math.PI * normalizedCutoff);
	const output = new Float32Array(input.length);

	output[0] = input[0] * (1 - a);
	for (let i = 1; i < input.length; i++) {
		output[i] = input[i] * (1 - a) + output[i - 1] * a;
	}

	return output;
}

function resampleLinear(input, inRate, outRate) {
	if (inRate === outRate) return input;
	const ratio = outRate / inRate;
	const outLen = Math.floor(input.length * ratio);
	const out = new Float32Array(outLen);
	for (let i = 0; i < outLen; i++) {
		const pos = i / ratio;
		const i0 = Math.floor(pos);
		const i1 = Math.min(input.length - 1, i0 + 1);
		const t = pos - i0;
		out[i] = input[i0] * (1 - t) + input[i1] * t;
	}
	return out;
}

// Note: Initialization now handled via init message from UI
