import { persisted } from 'svelte-persisted-store';
export const advancedExpanded = persisted<boolean>('advancedExpanded', false);
export const exampleStore = persisted<string>('exampleStore', '');
