import { describe, it, expect } from 'vitest';
import { RawAudio } from './utils';

function toAscii(data: ArrayBuffer, start: number, length: number) {
	const bytes = new Uint8Array(data, start, length);
	return String.fromCharCode(...bytes);
}

describe('RawAudio WAV encoding', () => {
	it('produces a valid WAV header and data size', () => {
		const sr = 24000;
		const samples = new Float32Array([0, 0.5, -0.5, 1, -1]);
		const wav = new RawAudio(samples, sr).toWav();

		expect(wav.byteLength).toBe(44 + samples.length * 4);
		expect(toAscii(wav, 0, 4)).toBe('RIFF');
		expect(toAscii(wav, 8, 4)).toBe('WAVE');
		expect(toAscii(wav, 12, 4)).toBe('fmt ');
		expect(toAscii(wav, 36, 4)).toBe('data');

		const view = new DataView(wav);
		const chunkSize = view.getUint32(4, true);
		expect(chunkSize).toBe(36 + samples.length * 4);

		const audioFormat = view.getUint16(20, true);
		const numChannels = view.getUint16(22, true);
		const sampleRate = view.getUint32(24, true);
		const byteRate = view.getUint32(28, true);
		const blockAlign = view.getUint16(32, true);
		const bitsPerSample = view.getUint16(34, true);
		const dataSize = view.getUint32(40, true);

		expect(audioFormat).toBe(3); // IEEE float
		expect(numChannels).toBe(1);
		expect(sampleRate).toBe(sr);
		expect(byteRate).toBe(sr * 4);
		expect(blockAlign).toBe(4);
		expect(bitsPerSample).toBe(32);
		expect(dataSize).toBe(samples.length * 4);
	});

	it('toBlob returns audio/wav of expected size', () => {
		const sr = 16000;
		const samples = new Float32Array(10);
		const blob = new RawAudio(samples, sr).toBlob();
		expect(blob.type).toBe('audio/wav');
		expect(blob.size).toBe(44 + samples.length * 4);
	});
});
