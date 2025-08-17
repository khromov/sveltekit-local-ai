import { chunkText, cleanTextForTTS } from './text-cleaner';

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
