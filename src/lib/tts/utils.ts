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
