<script lang="ts">
	interface Props {
		progress: number;
		previousProgress?: number;
		animated?: boolean;
	}

	let { progress = 0, previousProgress = 0, animated = true }: Props = $props();
</script>

<div class="my-2 w-full">
	<div class="relative h-5 w-full overflow-hidden rounded-md border-2 border-black bg-gray-100">
		<div
			class="relative h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 ease-in-out {animated
				? 'after:absolute after:inset-0 after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent'
				: ''}"
			style="width: {progress}%; transition: width {animated && progress > previousProgress
				? '0.3s'
				: '0s'} ease"
		></div>
	</div>
</div>
