import type { PageLoad } from './$types';

export const ssr = true;

export const load: PageLoad = ({ parent }) => {
	return parent().then((data) => ({
		...data,
		seo: {
			...data.seo,
			title: 'Count LLM Tokens - Local AI Tools',
			description:
				'Calculate token counts for different AI models. Understand API costs and context limits for Claude and ChatGPT models with our tokenizer tools.'
		}
	}));
};
