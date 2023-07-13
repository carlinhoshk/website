<script lang="ts" context="module">
	export const faqsKey = {};
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import FlexiblePricingTable from '../pricing/flexible-pricing-table.svelte';
	import Faq from './faq.svelte';
	import type { FAQ } from '$lib/types/faq';
	import StructuredData from './structured-data.svelte';

	export let useStructuredData = true;
	export let headlineClasses: string = '';
	export let faq: FAQ;

	setContext(faqsKey, writable(null));
</script>

<div class="max-w-6xl mx-auto">
	{#if faq.headline}
		<h2 class="text-center mb-x-small {headlineClasses}">{faq.headline}</h2>
		<slot name="subheading" />
	{/if}
	<div class="space-y-micro md:space-y-xx-small">
		<Faq title="How is my usage calculated?">
			<p class="max-w-5xl">
				Gitpod usage is measured in credits. Larger workspace classes
				use credits at a faster rate.<br /> 1 credit = $0.036.
			</p>
			<FlexiblePricingTable />
		</Faq>
		{#each faq.items as item}
			<Faq title={item.title}>
				{@html item.content}
			</Faq>
		{/each}
	</div>
</div>

{#if useStructuredData}
	<StructuredData {faq} />
{/if}
