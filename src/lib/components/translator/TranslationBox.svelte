<script lang="ts">
	export let label: string;
	export let text: string;
	export let disabled: boolean = false;
	export let placeholder: string = '';
</script>

<div class="translation-box">
	<label>{label}</label>
	<textarea bind:value={text} {placeholder} {disabled} rows="6"></textarea>
</div>

<style>
	.translation-box {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	label {
		font-weight: 600;
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
		color: #555;
	}

	textarea {
		width: 100%;
		height: 160px;
		padding: 1rem;
		border-radius: 12px;
		border: 2px solid #ffc4c3;
		background-color: white;
		font-family: 'Nunito', sans-serif;
		font-size: 1rem;
		line-height: 1.5;
		resize: none;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
		color: #333;
	}

	textarea:focus {
		outline: none;
		border-color: #ef6f6c;
		box-shadow: 0 0 0 3px rgba(239, 111, 108, 0.2);
	}

	textarea:disabled {
		background-color: #fafafa;
		color: #555;
		cursor: default;
	}

	/* Styling for the placeholder text */
	textarea::placeholder {
		color: #aaa;
		font-style: italic;
	}
</style>
