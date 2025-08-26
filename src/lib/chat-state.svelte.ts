// Global state for chat model loading status
export const chatState = $state({
	isModelLoaded: false
});

export function setModelLoaded(loaded: boolean) {
	chatState.isModelLoaded = loaded;
}
