import { describe, it, expect } from 'vitest';
import { cleanTextForTTS, chunkText } from './text-cleaner';

describe('text-cleaner', () => {
	it('cleanTextForTTS removes emojis and unwanted chars', () => {
		const input = 'Hello 👋 world — test (keep) / slash _ - \\\n+😊';
		const out = cleanTextForTTS(input);
		expect(out).toContain('Hello');
		expect(out).toContain('world');
		expect(out).not.toMatch(/[\u{1F600}-\u{1F64F}]/u); // no emojis
		expect(out).not.toContain('—');
		expect(out).not.toContain('(');
		expect(out).not.toContain(')');
		expect(out).not.toContain('\\');
	});

	it('chunkText splits lines into punctuated chunks', () => {
		const input = 'Line one without punctuation\nLine two ends here.\nShort';
		const chunks = chunkText(input);
		expect(chunks.length).toBeGreaterThanOrEqual(2);
		for (const c of chunks) {
			expect(/[.!?]$/.test(c)).toBe(true);
		}
	});

	it('chunkText handles long sentences by word splitting', () => {
		const long = 'a '.repeat(600); // > MAX_CHUNK_LENGTH
		const chunks = chunkText(long);
		expect(chunks.length).toBeGreaterThan(1);
		for (const c of chunks) {
			expect(c.length).toBeLessThanOrEqual(500);
		}
	});
});
