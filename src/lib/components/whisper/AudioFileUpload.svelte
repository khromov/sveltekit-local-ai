<script lang="ts">
	import { FileUpload } from '$lib/components/common';

	interface Props {
		selectedFile: File | null;
		onFileSelect: (file: File) => void;
		disabled?: boolean;
	}

	let { selectedFile = $bindable(), onFileSelect, disabled = false }: Props = $props();
</script>

<FileUpload
	mode="single"
	fileType="audio"
	bind:selectedFile
	{onFileSelect}
	{disabled}
	showFileInfo={true}
	variant="default"
/>
