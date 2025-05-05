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
		url: 'https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct-GGUF/resolve/main/smollm2-360m-instruct-q8_0.gguf',
		name: 'SmolLM2-360M-Instruct (q8_0)',
		size: 386404992
	},
	{
		url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q8_0.gguf',
		name: 'Qwen2.5-0.5B-Instruct (q8_0)',
		size: 675710816
	},
	{
		url: 'https://huggingface.co/hugging-quants/Llama-3.2-1B-Instruct-Q4_K_M-GGUF/resolve/main/llama-3.2-1b-instruct-q4_k_m.gguf',
		name: 'Llama-3.2-1B-Instruct (q4_k_m)',
		size: 807690656
	}
];

// Message type interface
export interface Message {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

// Storage helper functions
export const WllamaStorage = {
	save<T>(key: string, data: T) {
		localStorage.setItem(key, JSON.stringify(data));
	},

	load<T>(key: string, defaultValue: T): T {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultValue;
	}
};

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
