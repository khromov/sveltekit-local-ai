import { persisted } from 'svelte-persisted-store';
import { DEFAULT_INFERENCE_PARAMS, type Message } from './wllama-config';

export const chat = persisted<Message[]>('chat', []);
export const inferenceParams = persisted<any>('inferenceParams', DEFAULT_INFERENCE_PARAMS);
