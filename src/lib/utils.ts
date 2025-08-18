/// <reference types="@webgpu/types" />

export async function detectWebGPU() {
	try {
		const adapter = await navigator.gpu.requestAdapter();
		return !!adapter;
	} catch {
		return false;
	}
}

/**
 * Encode Float32Array audio data to WAV format
 * @param audioData - The audio data as Float32Array
 * @param sampleRate - The sample rate of the audio
 * @returns ArrayBuffer containing the WAV file
 */
function encodeWAV(audioData: Float32Array, sampleRate: number): ArrayBuffer {
	const length = audioData.length;
	const buffer = new ArrayBuffer(44 + length * 2);
	const view = new DataView(buffer);

	// WAV file header
	const writeString = (offset: number, string: string) => {
		for (let i = 0; i < string.length; i++) {
			view.setUint8(offset + i, string.charCodeAt(i));
		}
	};

	writeString(0, 'RIFF'); // ChunkID
	view.setUint32(4, 36 + length * 2, true); // ChunkSize
	writeString(8, 'WAVE'); // Format
	writeString(12, 'fmt '); // Subchunk1ID
	view.setUint32(16, 16, true); // Subchunk1Size
	view.setUint16(20, 1, true); // AudioFormat
	view.setUint16(22, 1, true); // NumChannels
	view.setUint32(24, sampleRate, true); // SampleRate
	view.setUint32(28, sampleRate * 2, true); // ByteRate
	view.setUint16(32, 2, true); // BlockAlign
	view.setUint16(34, 16, true); // BitsPerSample
	writeString(36, 'data'); // Subchunk2ID
	view.setUint32(40, length * 2, true); // Subchunk2Size

	// Convert float samples to 16-bit PCM
	let offset = 44;
	for (let i = 0; i < length; i++) {
		const sample = Math.max(-1, Math.min(1, audioData[i]));
		view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
		offset += 2;
	}

	return buffer;
}

/**
 * Save a blob as a file download
 * @param filename - The filename to save as
 * @param blob - The blob to save
 */
function saveBlob(filename: string, blob: Blob) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export class RawAudio {
	audio: Float32Array;
	sampling_rate: number;

	/**
	 * Create a new `RawAudio` object.
	 * @param audio Audio data
	 * @param sampling_rate Sampling rate of the audio data
	 */
	constructor(audio: Float32Array, sampling_rate: number) {
		this.audio = audio;
		this.sampling_rate = sampling_rate;
	}

	/**
	 * Convert the audio to a wav file buffer.
	 * @returns The WAV file.
	 */
	toWav(): ArrayBuffer {
		return encodeWAV(this.audio, this.sampling_rate);
	}

	/**
	 * Convert the audio to a blob.
	 * @returns Blob
	 */
	toBlob(): Blob {
		const wav = this.toWav();
		const blob = new Blob([wav], { type: 'audio/wav' });
		return blob;
	}

	/**
	 * Save the audio to a wav file.
	 * @param path filename to save as
	 */
	async save(path: string): Promise<void> {
		saveBlob(path, this.toBlob());
	}
}
