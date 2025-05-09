// Configuration for Wllama
import singleThreaded from '@wllama/wllama/src/single-thread/wllama.wasm?url';
import multiThreaded from '@wllama/wllama/src/multi-thread/wllama.wasm?url';

export const WLLAMA_CONFIG_PATHS = {
	'single-thread/wllama.wasm': singleThreaded,
	'multi-thread/wllama.wasm': multiThreaded
};

export const DEFAULT_INFERENCE_PARAMS = {
	nThreads: -1, // auto
	nContext: 4096,
	nPredict: 4096,
	nBatch: 128,
	temperature: 0.2
};

export const DEFAULT_CHAT_TEMPLATE =
	"{% for message in messages %}{{'<|im_start|>' + message['role'] + '\n' + message['content'] + '<|im_end|>' + '\n'}}{% endfor %}{% if add_generation_prompt %}{{ '<|im_start|>assistant\n' }}{% endif %}";

// Models available for download
export const AVAILABLE_MODELS = [
	{
		url: 'https://files.khromov.se/models/google_gemma-3-1b-it-qat-Q4_0.gguf',
		name: 'Gemma3 1B (bartowski/google_gemma-3-1b-it-qat-GGUF q4_0)',
		size: 757071872
	},
	{
		url: 'https://files.khromov.se/models/smollm2-360m-instruct-q8_0.gguf',
		name: 'SmolLM2 360M (ngxson/SmolLM2-360M-Instruct-Q8_0-GGUF q8_0)',
		size: 386404992
	}
];

export interface Message {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

// Helper to format human readable file sizes
export function formatFileSize(bytes: number): string {
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(1)} ${units[unitIndex]}`;
}
