<script lang="ts">
	import PricingBoxes from './pricing-boxes.svelte';
	import type { Pricing } from '$lib/types/pricing';
	import Header from '../header.svelte';
	import LinkButton from '../ui-library/link-button/link-button.svelte';
	import { isEurope } from '$lib/utils/helpers';

	export let pricingPlans: Pricing[] = [];
</script>

<Header
	class="md:!mb-x-small !mb-micro"
	title="Predictable, usage-based pricing"
	text="Plans for small teams and large enterprises."
	fullWidth={true}
/>
<div class="text-center !mt-8">
	<LinkButton
		variant="primary"
		size="large"
		href="https://gitpod.io/login"
		data-analytics={`{"context":"pricing"}`}
		>Start with 50h/month for free</LinkButton
	>
</div>
<div class="mt-small">
	{#if pricingPlans.length > 0}
		<PricingBoxes {pricingPlans} />
		<p class="mt-micro text-center">
			1 credit = {isEurope() ? '€' : '$'}0.036. All prices excluding VAT
		</p>
	{/if}
</div>
