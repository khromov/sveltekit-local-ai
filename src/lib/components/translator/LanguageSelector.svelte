<script lang="ts">
	export let languages: string[];
	export let selectedLanguage: string;
	export let onChange: (language: string) => void;
	export let disabled: boolean = false;
</script>

<div class="language-selector">
	<label for="language-select">Translate to:</label>
	<div class="select-wrapper">
		<select
			id="language-select"
			bind:value={selectedLanguage}
			on:change={(e) => onChange(e.currentTarget.value)}
			{disabled}
		>
			{#each languages as language}
				<option value={language}>{language}</option>
			{/each}
		</select>
		<div class="select-arrow"></div>
	</div>
</div>

<style>
	.language-selector {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	label {
		font-weight: 600;
		font-size: 1rem;
		color: #555;
		white-space: nowrap;
	}

	.select-wrapper {
		position: relative;
		min-width: 180px;
	}

	select {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		width: 100%;
		padding: 0.8rem 1rem;
		font-size: 1rem;
		background-color: white;
		border: 2px solid #ef6f6c;
		border-radius: 12px;
		color: #444;
		font-family: 'Nunito', sans-serif;
		cursor: pointer;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
	}

	select:focus {
		outline: none;
		border-color: #ef6f6c;
		box-shadow: 0 0 0 3px rgba(239, 111, 108, 0.2);
	}

	select:disabled {
		background-color: #f9f9f9;
		border-color: #ddd;
		color: #999;
		cursor: not-allowed;
	}

	.select-arrow {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 8px solid #ef6f6c;
		pointer-events: none;
	}

	select:disabled + .select-arrow {
		border-top-color: #ccc;
	}

	@media (max-width: 480px) {
		.language-selector {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
			width: 100%;
		}

		.select-wrapper {
			width: 100%;
		}
	}
</style>
