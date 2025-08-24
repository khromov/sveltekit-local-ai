import { describe, it, expect } from 'vitest';
import { formatFileSize } from './wllama-config';

describe('formatFileSize', () => {
	it('formats bytes to human readable units', () => {
		expect(formatFileSize(0)).toBe('0.0 B');
		expect(formatFileSize(512)).toBe('512.0 B');
		expect(formatFileSize(1024)).toBe('1.0 KB');
		expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
		expect(formatFileSize(1024 * 1024 * 5.5)).toBe('5.5 MB');
	});
});
