import { persisted } from 'svelte-persisted-store';
import { DEFAULT_INFERENCE_PARAMS, type Message } from './wllama-config';

export const messages = persisted<Message[]>('messages', []);
export const inferenceParams = persisted<any>('inferenceParams', DEFAULT_INFERENCE_PARAMS);
