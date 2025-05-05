import { persisted } from 'svelte-persisted-store';
import type { Message } from './wllama-config';

export const chat = persisted<Message[]>('chat', []);
export const inferenceParams = persisted<any>('inferenceParams', null);
