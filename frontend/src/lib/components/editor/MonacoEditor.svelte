<script lang="ts">
  import { mode } from "mode-watcher";
  import { get, type Writable } from "svelte/store";
  import { createEventDispatcher, onMount } from "svelte";
  import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
  // import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
  // import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
  // import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
  import type { editor as Editor } from "monaco-editor/esm/vs/editor/editor.api"

  import Loading from "$lib/components/site/Loading.svelte";
  import { themes } from "$lib/utils/monacoThemes";

  export let Content: Writable<string>;
  export let language: string = "json";
  export let readOnly: boolean = false;

  const dispatch = createEventDispatcher()
  const observer = new ResizeObserver(resizeEditor)

  let editorEl: HTMLDivElement;
  let editor: Editor.IStandaloneCodeEditor;

  mode.subscribe((currentMode) => {
    editor?.updateOptions({ "theme": currentMode === "dark" ? "customDark" : "customLight" })
  })

  self.MonacoEnvironment = {
    getWorker: function (_moduleId, label) {
      switch (label) {
        case "json": 
          return new jsonWorker();
        // case "css" || "scss" || "less": 
        //   return new cssWorker();
        // case "html" || "handlebars" || "razor": 
        //   return new htmlWorker();
        // case "typescript" || "javascript": 
        //   return new tsWorker();
        default: 
          return new editorWorker();
      }
    },
  };

  async function init() {
    const { editor: Editor} = await import("monaco-editor/esm/vs/editor/editor.api")
    
    Editor.defineTheme("customDark", themes.customDark)

    editor = Editor.create(editorEl, {
      theme: get(mode) === "dark" ? "customDark" : "customLight",
      value: get(Content),
      language,
      minimap: { enabled: false },
      lineNumbers: "off",
      wordWrap: "on",
      readOnly,
      fontSize: 15,
      
    });
    
    editor.onDidChangeModelContent(() => {
      const content = editor.getValue()
      dispatch("change", content);
      Content.set(content);
    });

    editor.onDidScrollChange((ev) => dispatch("scroll", ev))

    window.requestAnimationFrame(resizeEditor);

    if (editorEl.parentElement) observer.observe(editorEl.parentElement)
  }

  export function resizeEditor() {
    const rect = editorEl?.getBoundingClientRect()
    if (rect) editor.layout({ width: rect.width, height: rect.height });
  }

  onMount(() => {
    // cleanup function
    return () => editor.dispose();
  });
</script>

<svelte:window
  on:resize={() => {
    editor.layout({ width: 0, height: 0 });
    window.requestAnimationFrame(resizeEditor);
  }}
/>

<div bind:this={editorEl} class="h-full w-full" />

{#await init()}
  <Loading />
{:catch err}
  <h1 class="text-lg font-bold">Error</h1>
  <pre><code>{JSON.stringify(err, null, 2)}</code></pre>
{/await}
