<script lang="ts">
	import OpenGraph from '$lib/components/open-graph.svelte';
	import Hero from '$lib/components/dedicated/hero-text.svelte';
	import { dedicatedPageFeatures } from '$lib/contents/home/features';
	import SectionFeatures from '$lib/components/section-features.svelte';
	import Explore from '$lib/components/explore.svelte';
	import IntegrateDontDictate from '$lib/components/index/integrate-dont-dictate.svelte';
	import Card from '$lib/components/ui-library/card';
	import LinkButton from '$lib/components/ui-library/link-button/link-button.svelte';
</script>

<OpenGraph
	data={{
		title: 'Gitpod Dedicated: an isolated, single-tenant installation',
		keywords: 'dedicated, single-tenant, isolated, managed, private',
		description:
			'Get your private instance of Gitpod. Gitpod Dedicated is the right choice for large companies with high security and compliance requirements.',
	}}
/>

<Hero />

<div
	class="flex flex-col flex-wrap justify-center md:flex-row !mb-x-large md:!mb-0 space-y-3 md:space-y-0 max-w-[1104px] gap-x-4 gap-y-4 mx-auto mt-medium"
>
	<Card
		size="medium"
		class="gap-small shadow-normal md:p-x-large flex items-start text-left mx-auto py-small px-xx-small max-w-[400px] md:max-w-[544px]"
	>
		<div
			class="flex flex-wrap flex-col text-left h-full w-full justify-between"
		>
			<h2 class="h3 !mb-8">Get started</h2>
			<ol class="inline-flex flex-col space-y-micro text-left">
				<li class="relative inline-flex">
					<span class="font-bold text-primary pr-4">1.</span>
					Request a CloudFormation template.
				</li>
				<li class="relative inline-flex">
					<span class="font-bold text-primary pr-4">2.</span>
					Execute CloudFormation template within your Cloud account.
				</li>
				<li class="relative inline-flex">
					<span class="font-bold text-primary pr-4">3.</span>
					Spin-up a Gitpod CDE.
				</li>
			</ol>
			<div class="mt-8">
				<LinkButton
					variant="primary"
					size="large"
					href="/contact/sales?subject=Dedicated%20self-serve"
					>Request template</LinkButton
				>
			</div>
		</div>
	</Card>
	<Card
		size="medium"
		class="gap-small shadow-normal md:p-x-large flex items-start text-left mx-auto py-small px-xx-small max-w-[400px] md:max-w-[544px]"
	>
		<div
			class="flex flex-wrap flex-col text-left h-full w-full justify-between"
		>
			<h2 class="h3">Help from an expert</h2>
			<p class="text-lg">
				Our team is available to help answer any questions about CDEs or
				your use case to get started as soon as possible!
			</p>
			<div class="mt-12">
				<LinkButton
					variant="cta"
					size="large"
					href="/contact/sales?subject=enterprise"
					>Talk to an expert</LinkButton
				>
			</div>
		</div>
	</Card>
</div>

<SectionFeatures
	title="The security & control of a self-hosted solution"
	features={dedicatedPageFeatures}
/>
<IntegrateDontDictate
	class="py-small"
	title="Integrates into your orgs existing development infrastructure"
/>
<Explore
	contents={{
		title: 'Gitpod Dedicated pricing',
		description: 'Pay-per-user and scale predictably.',
		link: {
			href: '/pricing',
			text: 'More on pricing',
		},
	}}
/>
