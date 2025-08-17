export const quotes = [
  "Svelte is a compile-time framework that transforms declarative components into optimized vanilla JavaScript",
  "Svelte's runes are $-prefixed keywords that control the compiler behavior and don't need to be imported",
  "Svelte runes are built into the language as globals and can't be assigned to variables or passed as function arguments",
  "Svelte's $state() creates reactive variables that automatically update the UI when their values change",
  "Svelte's $state automatically converts arrays and objects into deeply reactive proxies for granular updates",
  "Svelte's $derived creates computed values that recalculate whenever their dependencies change",
  "Svelte's $effect handles side effects and runs only in the browser, never during server-side rendering",
  "Svelte's $props() is the modern way to receive and destructure component props in version 5",
  "Svelte's $bindable() enables true two-way data binding between parent and child components",
  "Svelte's $inspect() provides reactive debugging that logs values whenever they change (development only)",
  "Svelte's $host() gives access to the host element when creating custom web components",
  "Svelte components are written in .svelte files using an enhanced version of HTML syntax",
  "Svelte's .svelte.js and .svelte.ts files can use runes outside of components for shared reactive logic",
  "Svelte CSS styles are automatically scoped to components using generated hash-based class names",
  "Svelte's :global() modifier allows styles to escape component scoping and affect the entire application",
  "Svelte custom CSS properties can be passed to components as props using --variable-name syntax",
  "Svelte's snippets replace version 4's slot system and offer more flexibility for reusable markup patterns",
  "Svelte error boundaries catch rendering errors and provide graceful fallback UI with <svelte:boundary>",
  "Svelte's lifecycle is simplified to just onMount, onDestroy, and tick - effects handle granular updates",
  "Svelte's Context API provides a clean way to pass data through component trees without prop drilling",
  "Svelte stores remain useful for complex async patterns, though runes handle most reactive state needs",
  "Svelte's TypeScript integration works seamlessly with lang='ts' and supports full preprocessing",
  "Svelte's keyed each blocks use (key) syntax to enable efficient list reordering and updates",
  "Svelte's transition system supports enter/leave animations with transition:, in:, and out: directives",
  "Svelte's two-way binding uses the bind: directive for form inputs, dimensions, and component props",
  "Svelte's special elements like <svelte:window> and <svelte:document> handle global event listeners",
  "Svelte's experimental await expressions in markup require <svelte:boundary> with pending snippets",
  "Svelte's actions via use: directive add custom behavior to elements (attachments are preferred in 5.29+)",
  "Svelte's imperative APIs include mount(), unmount(), hydrate(), and render() for programmatic control",
  "Svelte testing integrates well with Vitest for unit tests and Playwright for end-to-end testing"
];

export function getRandomQuote(): string {
  return quotes[Math.floor(Math.random() * quotes.length)];
}