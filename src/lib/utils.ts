/// <reference types="@webgpu/types" />

export async function detectWebGPU() {
	try {
		const adapter = await navigator.gpu.requestAdapter();
		return !!adapter;
	} catch {
		return false;
	}
}

function encodeWAV(audioData: Float32Array, sampleRate: number): ArrayBuffer {
	const length = audioData.length;
	const buffer = new ArrayBuffer(44 + length * 2);
	const view = new DataView(buffer);

	const writeString = (offset: number, string: string) => {
		for (let i = 0; i < string.length; i++) {
			view.setUint8(offset + i, string.charCodeAt(i));
		}
	};

	writeString(0, 'RIFF');
	view.setUint32(4, 36 + length * 2, true);
	writeString(8, 'WAVE');
	writeString(12, 'fmt ');
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true);
	view.setUint16(22, 1, true);
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, sampleRate * 2, true);
	view.setUint16(32, 2, true);
	view.setUint16(34, 16, true);
	writeString(36, 'data');
	view.setUint32(40, length * 2, true);

	let offset = 44;
	for (let i = 0; i < length; i++) {
		const sample = Math.max(-1, Math.min(1, audioData[i]));
		view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
		offset += 2;
	}

	return buffer;
}

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

	constructor(audio: Float32Array, sampling_rate: number) {
		this.audio = audio;
		this.sampling_rate = sampling_rate;
	}

	toWav(): ArrayBuffer {
		return encodeWAV(this.audio, this.sampling_rate);
	}

	toBlob(): Blob {
		const wav = this.toWav();
		const blob = new Blob([wav], { type: 'audio/wav' });
		return blob;
	}

	async save(path: string): Promise<void> {
		saveBlob(path, this.toBlob());
	}
}
