<script lang="ts">
    import { onMount } from "svelte";
    const { data } = $props();
    let content: number[] = $state([]);
    onMount(() => {
        if(data.encoder) {
            console.log("Encoding with", data.encoder);
            content = data.encoder.encode("hello world");
        }
    });
</script>

{JSON.stringify(content)}