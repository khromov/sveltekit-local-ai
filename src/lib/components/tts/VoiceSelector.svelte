<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import PlayIcon from 'virtual:icons/lucide/play';
	import SquareIcon from 'virtual:icons/lucide/square';
	import ChevronDownIcon from 'virtual:icons/lucide/chevron-down';

	interface Voice {
		id: string | number;
		name: string;
	}

	interface Props {
		voices: Voice[];
		selectedVoice: string | number;
		modelType: string;
		onVoiceChange: (voiceId: string | number) => void;
		onVoicePreview?: (params: { voice: string | number; text?: string; action: 'play' | 'stop' }) => void;
	}

	let { voices, selectedVoice, modelType, onVoiceChange, onVoicePreview }: Props = $props();

	let isExpanded = $state(false);
	let previewingVoice = $state<string | number | null>(null);

	function handleVoiceChange(voiceId: string | number) {
		onVoiceChange(voiceId);
		isExpanded = false;
	}

	async function handlePreview(voiceId: string | number, voiceName: string) {
		if (previewingVoice === voiceId) {
			// Stop preview
			previewingVoice = null;
			onVoicePreview?.({ voice: voiceId, action: 'stop' });
		} else {
			// Stop any existing preview first
			if (previewingVoice) {
				onVoicePreview?.({ voice: previewingVoice, action: 'stop' });
			}
			
			// Start new preview
			previewingVoice = voiceId;
			const previewText = getPreviewText(voiceName);
			onVoicePreview?.({ voice: voiceId, text: previewText, action: 'play' });
			
			// Auto-reset after a reasonable time if no explicit stop
			setTimeout(() => {
				if (previewingVoice === voiceId) {
					previewingVoice = null;
				}
			}, 10000); // 10 seconds max
		}
	}

	function getPreviewText(voiceName: string): string {
		// Use different preview texts based on voice characteristics
		const name = voiceName.toLowerCase();
		if (name.includes('heart')) return "Hello! I'm Heart, your friendly voice assistant.";
		if (name.includes('bella')) return "Hi there! I'm Bella, ready to bring your words to life.";
		if (name.includes('nova')) return "Greetings! I'm Nova, here to make your content shine.";
		if (name.includes('sarah')) return "Hello! I'm Sarah, delighted to speak for you.";
		if (name.includes('adam')) return "Hi! I'm Adam, your reliable voice companion.";
		if (name.includes('echo')) return "Hello there! I'm Echo, echoing your thoughts perfectly.";
		
		// Default preview text
		return `Hi! I'm ${voiceName.replace(/\s*\(.*?\)\s*/g, '')}, nice to meet you!`;
	}

	function getSelectedVoice() {
		return voices.find(voice => voice.id == selectedVoice);
	}

	function handlePreviewEnded() {
		previewingVoice = null;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.voice-selector-container')) {
			isExpanded = false;
		}
	}

	onMount(() => {
		document.addEventListener('voicePreviewEnded', handlePreviewEnded);
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		document.removeEventListener('voicePreviewEnded', handlePreviewEnded);
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="voice-selector-container">
	<button
		class="voice-selector-button"
		class:expanded={isExpanded}
		onclick={() => isExpanded = !isExpanded}
	>
		<span class="selected-voice">{getSelectedVoice()?.name || 'Select Voice'}</span>
		<span class="arrow-icon" class:rotated={isExpanded}>
			<ChevronDownIcon />
		</span>
	</button>

	{#if isExpanded}
		<div class="voice-dropdown">
			{#each voices as voice (voice.id)}
				<div 
					class="voice-option"
					class:selected={voice.id == selectedVoice}
				>
					<button
						class="voice-name-btn"
						onclick={() => handleVoiceChange(voice.id)}
					>
						{voice.name}
					</button>
					
					{#if onVoicePreview}
						<button
							class="preview-btn"
							onclick={(e) => {
								e.stopPropagation();
								handlePreview(voice.id, voice.name);
							}}
							title={previewingVoice === voice.id ? 'Stop preview' : 'Preview voice'}
						>
							{#if previewingVoice === voice.id}
								<SquareIcon />
							{:else}
								<PlayIcon />
							{/if}
						</button>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.voice-selector-container {
		position: relative;
		width: 100%;
		min-width: 160px;
	}

	.voice-selector-button {
		width: 100%;
		padding: 0.625rem 0.875rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: var(--shadow-brutalist-small);
		font-family: var(--font-family-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.voice-selector-button:hover {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.voice-selector-button.expanded {
		background: var(--color-primary);
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
	}

	.selected-voice {
		color: var(--color-text-primary);
		text-align: left;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.arrow-icon {
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.arrow-icon :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.arrow-icon.rotated {
		transform: rotate(180deg);
	}

	.voice-dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		max-height: 240px;
		overflow-y: auto;
		z-index: 100;
		animation: dropdownOpen 0.2s ease-out;
	}

	@keyframes dropdownOpen {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.voice-option {
		display: flex;
		align-items: center;
		border-bottom: var(--border-brutalist-thin);
		transition: background 0.15s;
	}

	.voice-option:last-child {
		border-bottom: none;
	}

	.voice-option:hover {
		background: var(--color-background-tertiary);
	}

	.voice-option.selected {
		background: var(--color-success);
	}

	.voice-name-btn {
		flex: 1;
		padding: 0.75rem 0.875rem;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		font-family: var(--font-family-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.preview-btn {
		padding: 0.5rem;
		margin: 0.25rem 0.5rem 0.25rem 0;
		background: var(--color-background-main);
		border: var(--border-brutalist-thin);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s;
		color: var(--color-text-primary);
	}

	.preview-btn :global(svg) {
		width: 1rem;
		height: 1rem;
	}

	.preview-btn:hover {
		background: var(--color-primary);
		transform: scale(1.1);
	}

	.voice-dropdown::-webkit-scrollbar {
		width: 8px;
	}

	.voice-dropdown::-webkit-scrollbar-track {
		background: var(--color-background-tertiary);
	}

	.voice-dropdown::-webkit-scrollbar-thumb {
		background: var(--color-text-primary);
		border-radius: 4px;
	}

	@media (max-width: 600px) {
		.voice-selector-container {
			min-width: auto;
		}
	}
</style>