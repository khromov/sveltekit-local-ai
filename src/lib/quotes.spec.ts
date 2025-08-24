import { describe, it, expect } from 'vitest';
import { quotes, getRandomQuote } from './quotes';

describe('quotes', () => {
	it('getRandomQuote returns a member of quotes', () => {
		const q = getRandomQuote();
		expect(typeof q).toBe('string');
		expect(quotes).toContain(q);
	});
});
