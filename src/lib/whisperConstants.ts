export const DEFAULT_MODEL = 'Xenova/whisper-tiny';
export const DEFAULT_SUBTASK = 'transcribe';
export const DEFAULT_LANGUAGE = 'english';
export const DEFAULT_QUANTIZED = true;
export const DEFAULT_MULTILINGUAL = false;

export interface WhisperModelOption {
    path: string;
    name: string;
}

export const AVAILABLE_MODELS: WhisperModelOption[] = [
    { path: "Xenova/whisper-tiny", name: 'Whisper Tiny' },
    { path: "Xenova/whisper-tiny.en", name: 'Whisper Tiny English' },
    { path: "Xenova/whisper-small", name: 'Whisper Small' },
    { path: "Xenova/whisper-small.en", name: 'Whisper Small English' },
    { path: "Xenova/whisper-medium", name: 'Whisper Medium' },
    { path: "Xenova/whisper-medium.en", name: 'Whisper Medium English' },
    { path: "Xenova/whisper-large-v3", name: 'Whisper Large v3' },
    { path: "distil-whisper/distil-large-v2", name: 'Distil Whisper Large v2' },
];