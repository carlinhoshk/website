<script>
	import Explore from '$lib/components/explore.svelte';
	import Faqs from '$lib/components/pricing/faqs.svelte';
	import OpenGraph from '$lib/components/open-graph.svelte';
	import PlansAndPricing from '$lib/components/pricing/plans-and-pricing.svelte';
	import { pricingPlans, pricingTable } from '$lib/contents/pricing';
	import Empower from '$lib/components/pricing/empower.svelte';
	import FeatureTable from '$lib/components/ui-library/feature-table/feature-table.svelte';
	import SectionCommon from '$lib/components/section-common.svelte';
	import Calculator from '$lib/components/pricing/calculator/index.svelte';
	import Section from '$lib/components/section.svelte';
	import LinkButton from '$lib/components/ui-library/link-button/link-button.svelte';
</script>

<OpenGraph
	data={{
		description:
			'Gitpod is always free for 50h/month. Upgrade to unlock more hours and features. SaaS and Self-Hosted. Talk to an expert.',
		title: 'Plans and Pricing - Gitpod',
		keywords: 'Pricing Gitpod, costs, free, saas, fees, self-hosted',
	}}
/>
<PlansAndPricing {pricingPlans} />

<Section>
	<div class="mb-small md:mb-x-medium">
		<h2 id="cost-estimator" class="text-center h2 mb-macro md:!mb-micro">
			Pricing calculator
		</h2>
		<p class="text-large text-center mx-auto">
			Estimate costs for your Organization.
		</p>
		<div class="text-center mt-micro md:mt-x-small">
			<LinkButton
				variant="cta"
				size="large"
				href="/docs/configure/billing"
				>More about billing and credits</LinkButton
			>
		</div>
	</div>
	<Calculator />
</Section>

<SectionCommon
	titleClassNames="!mb-micro"
	title="Compare features"
	text="Start using Gitpod CDEs for free, upgrade anytime."
	textClassNames="mb-micro md:mb-small"
	isTitleADeepLink={true}
>
	<div slot="content">
		<FeatureTable tableData={pricingTable} />
	</div>
</SectionCommon>
<Empower />
<Faqs />

<Explore />
