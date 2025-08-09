<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		value: string;
		isGenerating?: boolean;
		onSend: () => void;
		onStop?: () => void;
		placeholder?: string;
	}

	let {
		value = $bindable(),
		isGenerating = false,
		onSend,
		onStop,
		placeholder = 'Type your message...'
	}: Props = $props();

	let inputElement: HTMLTextAreaElement | undefined = $state();

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (!isGenerating && value.trim()) {
				onSend();
			}
		}
	}

	function focusAfterMount(node: HTMLTextAreaElement) {
		if (node && !node.disabled) {
			node.focus();
		}
	}

	export function focus() {
		if (inputElement) {
			inputElement.focus();
		}
	}

	onMount(() => {
		focus();
	});
</script>

<div class="bg-gradient-light relative overflow-hidden border-t-[3px] border-black p-5">
	<div
		class="bg-repeating-stripes-2 animate-slide absolute -top-[2px] right-0 left-0 h-[3px]"
	></div>

	{#if isGenerating && onStop}
		<button
			onclick={onStop}
			class="bg-gradient-red shadow-neo-lg font-space animate-shake hover:shadow-neo-2xl mx-auto mb-4 flex -rotate-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-black px-5 py-3 text-[0.9375rem] font-bold tracking-[0.5px] text-black uppercase transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:rotate-0 hover:animate-none"
		>
			<span class="text-[1.125rem]">🛑</span>
			Stop Generation
		</button>
	{/if}

	<div
		class="shadow-neo-lg hover:enabled:shadow-neo-2xl relative mb-3 flex -rotate-[0.5deg] items-end overflow-hidden rounded-xl border-[3px] border-black bg-white p-0 transition-all duration-200 hover:enabled:-translate-x-0.5 hover:enabled:-translate-y-0.5 hover:enabled:rotate-0 {isGenerating
			? 'bg-gradient-gray opacity-70'
			: ''}"
	>
		<span
			class="bg-neo-green absolute -top-[15px] left-[10px] z-[1] animate-[bounce_3s_ease-in-out_infinite] rounded border-2 border-black px-2 text-[1.5rem]"
			>💭</span
		>
		<textarea
			id="chat"
			bind:this={inputElement}
			bind:value
			{placeholder}
			rows="1"
			disabled={isGenerating}
			use:focusAfterMount
			onkeydown={handleKeyDown}
			class="font-space max-h-[120px] min-h-[22px] flex-grow resize-none border-none bg-transparent px-4 py-[0.875rem] pt-5 text-base leading-[1.4] font-medium text-black outline-none placeholder:font-normal placeholder:text-gray-400"
		></textarea>
		<button
			onclick={onSend}
			disabled={isGenerating || !value.trim()}
			class="bg-gradient-yellow shadow-neo-sm hover:enabled:bg-gradient-green hover:enabled:shadow-neo active:enabled:shadow-neo-sm m-2 flex h-11 w-11 rotate-[5deg] cursor-pointer items-center justify-center self-center rounded-lg border-2 border-black text-black transition-all duration-200 hover:enabled:scale-110 hover:enabled:rotate-0 active:enabled:scale-95 disabled:rotate-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50"
			aria-label="Send message"
		>
			<svg
				viewBox="0 0 24 24"
				width="20"
				height="20"
				stroke="currentColor"
				stroke-width="2.5"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="22" y1="2" x2="11" y2="13"></line>
				<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
			</svg>
		</button>
	</div>

	<div
		class="mx-auto flex w-fit max-w-[300px] items-center justify-center gap-1 rounded border border-gray-300 bg-gray-100 px-3 py-2 text-center text-xs font-normal text-gray-600"
	>
		<span class="text-[0.875rem]">💡</span>
		Model responses may not always be accurate.
	</div>
</div>
