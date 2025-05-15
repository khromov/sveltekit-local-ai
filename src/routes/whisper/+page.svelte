<script lang="ts">
  //import createModule from "@transcribe/shout";
  import { onMount } from "svelte";
  //import type { FileTranscriber } from "@transcribe/transcriber";

  let transcriber: any;

  onMount(async () => {
    const createModuleImport = await import("@transcribe/shout");
    // create new instance
    /*
    ip.FileTranscriber.transcriber = new ip.FileTranscriber({
      createModule,
      model: "/ggml-tiny-q5_1.bin",
    });

    // and initialize the transcriber
    await transcriber.init();
    */
  });
</script>

123