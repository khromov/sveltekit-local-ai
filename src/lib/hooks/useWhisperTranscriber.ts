import { useWhisperWorker } from './useWhisperWorker';
import { DEFAULT_MODEL, DEFAULT_SUBTASK, DEFAULT_LANGUAGE, DEFAULT_QUANTIZED, DEFAULT_MULTILINGUAL } from '../whisperConstants';

export interface ProgressItem {
    file: string;
    loaded: number;
    progress: number;
    total: number;
    name: string;
    status: string;
}

interface TranscriberUpdateData {
    data: [
        string,
        { chunks: { text: string; timestamp: [number, number | null] }[] },
    ];
}

interface TranscriberCompleteData {
    data: {
        text: string;
        chunks: { text: string; timestamp: [number, number | null] }[];
    };
}

export interface TranscriberData {
    isBusy: boolean;
    text: string;
    chunks: { text: string; timestamp: [number, number | null] }[];
}

export interface Transcriber {
    onInputChange: () => void;
    isBusy: boolean;
    isModelLoading: boolean;
    progressItems: ProgressItem[];
    start: (audioData: AudioBuffer | undefined) => void;
    output?: TranscriberData;
    model: string;
    setModel: (model: string) => void;
    multilingual: boolean;
    setMultilingual: (model: boolean) => void;
    quantized: boolean;
    setQuantized: (model: boolean) => void;
    subtask: string;
    setSubtask: (subtask: string) => void;
    language?: string;
    setLanguage: (language: string) => void;
}

export function useWhisperTranscriber(): Transcriber {
    let isBusy = $state(false);
    let isModelLoading = $state(false);
    let transcript = $state<TranscriberData | undefined>(undefined);
    let progressItems = $state<ProgressItem[]>([]);

    // Model configuration state
    let model = $state(DEFAULT_MODEL);
    let subtask = $state(DEFAULT_SUBTASK);
    let quantized = $state(DEFAULT_QUANTIZED);
    let multilingual = $state(DEFAULT_MULTILINGUAL);
    let language = $state(DEFAULT_LANGUAGE);

    const webWorker = useWhisperWorker((event) => {
        const message = event.data;
        // Update the state with the result
        switch (message.status) {
            case "progress":
                // Model file progress: update one of the progress items.
                progressItems = progressItems.map((item) => {
                    if (item.file === message.file) {
                        return { ...item, progress: message.progress };
                    }
                    return item;
                });
                break;
            case "update":
                // Received partial update
                const updateMessage = message as unknown as TranscriberUpdateData;
                transcript = {
                    isBusy: true,
                    text: updateMessage.data[0],
                    chunks: updateMessage.data[1].chunks,
                };
                break;
            case "complete":
                // Received complete transcript
                const completeMessage = message as unknown as TranscriberCompleteData;
                transcript = {
                    isBusy: false,
                    text: completeMessage.data.text,
                    chunks: completeMessage.data.chunks,
                };
                isBusy = false;
                break;

            case "initiate":
                // Model file start load: add a new progress item to the list.
                isModelLoading = true;
                progressItems = [...progressItems, message];
                break;
            case "ready":
                isModelLoading = false;
                break;
            case "error":
                isBusy = false;
                alert(
                    `${message.data.message} This is most likely because of browser compatibility issues or insufficient memory. Please try a smaller model or a different browser.`
                );
                break;
            case "done":
                // Model file loaded: remove the progress item from the list.
                progressItems = progressItems.filter((item) => item.file !== message.file);
                break;

            default:
                // initiate/download/done
                break;
        }
    });

    function onInputChange() {
        transcript = undefined;
    }

    async function start(audioData: AudioBuffer | undefined) {
        if (audioData) {
            transcript = undefined;
            isBusy = true;

            let audio;
            if (audioData.numberOfChannels === 2) {
                const SCALING_FACTOR = Math.sqrt(2);

                let left = audioData.getChannelData(0);
                let right = audioData.getChannelData(1);

                audio = new Float32Array(left.length);
                for (let i = 0; i < audioData.length; ++i) {
                    audio[i] = SCALING_FACTOR * (left[i] + right[i]) / 2;
                }
            } else {
                // If the audio is not stereo, we can just use the first channel:
                audio = audioData.getChannelData(0);
            }

            webWorker.postMessage({
                audio,
                model,
                multilingual,
                quantized,
                subtask: multilingual ? subtask : null,
                language: multilingual && language !== "auto" ? language : null,
            });
        }
    }

    return {
        onInputChange,
        isBusy,
        isModelLoading,
        progressItems,
        start,
        output: transcript,
        model,
        setModel: (newModel: string) => { model = newModel },
        multilingual,
        setMultilingual: (newMultilingual: boolean) => { multilingual = newMultilingual },
        quantized,
        setQuantized: (newQuantized: boolean) => { quantized = newQuantized },
        subtask,
        setSubtask: (newSubtask: string) => { subtask = newSubtask },
        language,
        setLanguage: (newLanguage: string) => { language = newLanguage },
    };
}