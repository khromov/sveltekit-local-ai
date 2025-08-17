import { persisted } from 'svelte-persisted-store';
import { DEFAULT_INFERENCE_PARAMS, type Message } from './wllama-config';

export const messages = persisted<Message[]>('messages', []);
export const inferenceParams = persisted<{
	nThreads: number;
	nContext: number;
	nPredict: number;
	nBatch: number;
	temperature: number;
}>('inferenceParams', DEFAULT_INFERENCE_PARAMS);
export const whisperModel = persisted<string>('whisperModel', '');
export const ttsModel = persisted<'kitten' | 'piper' | 'kokoro' | null>('ttsModel', null);
export const ttsWebGPUKitten = persisted<boolean>('ttsWebGPUKitten', false);
export const ttsWebGPUKokoro = persisted<boolean>('ttsWebGPUKokoro', false);
export const ttsKittenSampleRate = persisted<number>('ttsKittenSampleRate', 24000);
export const advancedExpanded = persisted<boolean>('advancedExpanded', false);
