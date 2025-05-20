/* eslint-disable camelcase */
// @ts-nocheck
import { pipeline, env, AutomaticSpeechRecognitionPipeline } from "@xenova/transformers";

// Disable local models
env.allowLocalModels = false;

// Define model factories
// Ensures only one model is created of each type
class PipelineFactory {
    static task: string | null = null;
    static model: string | null = null;
    static quantized: boolean | null = null;
    static instance: any = null;

    tokenizer: any;
    model: any;
    quantized: any;

    constructor(tokenizer: any, model: any, quantized: any) {
        this.tokenizer = tokenizer;
        this.model = model;
        this.quantized = quantized;
    }

    static async getInstance(progress_callback: ((data: any) => void) | null = null) {
        if (this.instance === null && this.task !== null && this.model !== null) {
            this.instance = pipeline(this.task as any, this.model, {
                quantized: this.quantized,
                progress_callback,
                // For medium models, we need to load the `no_attentions` revision to avoid running out of memory
                revision: this.model && this.model.includes("/whisper-medium") ? "no_attentions" : "main"
            });
        }

        return this.instance;
    }
}

self.addEventListener("message", async (event) => {
    const message = event.data;

    // Process the audio data
    let transcript = await transcribe(
        message.audio,
        message.model,
        message.multilingual,
        message.quantized,
        message.subtask,
        message.language,
    );
    if (transcript === null) return;

    // Send the result back to the main thread
    self.postMessage({
        status: "complete",
        task: "automatic-speech-recognition",
        data: transcript,
    });
});

class AutomaticSpeechRecognitionPipelineFactory extends PipelineFactory {
    static override task = "automatic-speech-recognition";
    static override model: string | null = null;
    static override quantized: boolean | null = null;
}

interface ChunkData {
    tokens: number[];
    finalised: boolean;
    is_last?: boolean;
}

const transcribe = async (
    audio: Float32Array,
    model: string,
    multilingual: boolean,
    quantized: boolean,
    subtask: string,
    language: string,
) => {
    const isDistilWhisper = model.startsWith("distil-whisper/");

    let modelName = model;
    if (!isDistilWhisper && !multilingual) {
        modelName += ".en"
    }

    const p = AutomaticSpeechRecognitionPipelineFactory;
    if (p.model !== modelName || p.quantized !== quantized) {
        // Invalidate model if different
        p.model = modelName;
        p.quantized = quantized;

        if (p.instance !== null) {
            const instance = await p.getInstance();
            if (instance && typeof instance.dispose === 'function') {
                instance.dispose();
            }
            p.instance = null;
        }
    }

    // Load transcriber model
    let transcriber = await p.getInstance((data: any) => {
        self.postMessage(data);
    }) as AutomaticSpeechRecognitionPipeline;

    const time_precision =
        (transcriber.processor.feature_extractor.config as any).chunk_length /
        (transcriber.model.config as any).max_source_positions;

    // Storage for chunks to be processed. Initialise with an empty chunk.
    let chunks_to_process: ChunkData[] = [
        {
            tokens: [],
            finalised: false,
        },
    ];

    function chunk_callback(chunk: ChunkData) {
        let last = chunks_to_process[chunks_to_process.length - 1];

        // Overwrite last chunk with new info
        Object.assign(last, chunk);
        last.finalised = true;

        // Create an empty chunk after, if it not the last chunk
        if (!chunk.is_last) {
            chunks_to_process.push({
                tokens: [],
                finalised: false,
            });
        }
    }

    // Inject custom callback function to handle merging of chunks
    function callback_function(item: any) {
        let last = chunks_to_process[chunks_to_process.length - 1];

        // Update tokens of last chunk
        last.tokens = [...item[0].output_token_ids];

        // Merge text chunks
        // TODO optimise so we don't have to decode all chunks every time
        let data = (transcriber.tokenizer as any)._decode_asr(chunks_to_process, {
            time_precision: time_precision,
            return_timestamps: true,
            force_full_sequences: false,
        });

        self.postMessage({
            status: "update",
            task: "automatic-speech-recognition",
            data: data,
        });
    }

    // Actually run transcription
    let output = await transcriber(audio, {
        // Greedy
        top_k: 0,
        do_sample: false,

        // Sliding window
        chunk_length_s: isDistilWhisper ? 20 : 30,
        stride_length_s: isDistilWhisper ? 3 : 5,

        // Language and task
        language: language,
        task: subtask,

        // Return timestamps
        return_timestamps: true,
        force_full_sequences: false,

        // Callback functions
        callback_function: callback_function, // after each generation step
        chunk_callback: chunk_callback, // after each chunk is processed
    }).catch((error) => {
        self.postMessage({
            status: "error",
            task: "automatic-speech-recognition",
            data: error,
        });
        return null;
    });

    return output;
};