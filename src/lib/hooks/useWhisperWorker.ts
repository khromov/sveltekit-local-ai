// This is a Svelte-compatible version of the worker hook
// based on the React implementation in xenova/whisper-web

export interface MessageEventHandler {
    (event: MessageEvent): void;
}

export function useWhisperWorker(messageEventHandler: MessageEventHandler): Worker {
    // Create new worker (no need for useState in Svelte)
    return createWorker(messageEventHandler);
}

function createWorker(messageEventHandler: MessageEventHandler): Worker {
    // Need to use new URL for vite bundling
    const worker = new Worker(new URL('../whisperWorker.js', import.meta.url), {
        type: "module",
    });
    // Listen for messages from the Web Worker
    worker.addEventListener("message", messageEventHandler);
    return worker;
}