import { persisted } from 'svelte-persisted-store';
import { DEFAULT_INFERENCE_PARAMS, type Message } from './chat-config';

export const messages = persisted<Message[]>('messages', []);
export const inferenceParams = persisted<{
	nThreads: number;
	nContext: number;
	nPredict: number;
	nBatch: number;
	temperature: number;
}>('inferenceParams', DEFAULT_INFERENCE_PARAMS);
export const whisperModel = persisted<string>('whisperModel', '');
