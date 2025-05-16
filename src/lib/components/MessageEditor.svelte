<script lang="ts">
	export let message: string;
	export let presets: string[];
	export let selectPreset: (preset: string) => void;
</script>

<div class="presets">
	<h3>Example Messages:</h3>
	<div class="preset-buttons">
		{#each presets as preset}
			<button onclick={() => selectPreset(preset)} class="preset-btn">
				{preset}
			</button>
		{/each}
	</div>
</div>

<style>
	.presets {
		width: 100%;
		margin-bottom: 1rem;
	}

	h3 {
		font-family: 'Nunito', 'Comic Sans MS', cursive, sans-serif;
		color: #5c8d89;
		text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
		text-align: center;
		margin-bottom: 0.75rem;
	}

	.preset-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.preset-btn {
		background-color: #fef0d5;
		color: #5b5b5b;
		border: 2px solid #f8d488;
		border-radius: 12px;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
		font-family: 'Nunito', sans-serif;
	}

	.preset-btn:hover {
		background-color: #f8d488;
		transform: translateY(-2px);
	}
</style>
