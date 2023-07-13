<script lang="ts">
	import { dedicatedFeatures } from '$lib/contents/home/features';
	import Testimonials from '$lib/components/index/testimonials.svelte';
	import { testimonials } from '$lib/contents/home/index';
	import OpenGraph from '$lib/components/open-graph.svelte';
	import LinkButton from '$lib/components/ui-library/link-button';
	import Section from '$lib/components/section.svelte';
	import Features from '$lib/components/features.svelte';
	import Signup from '$lib/components/dedicated/signup.svelte';
	import SectionCommon from '$lib/components/section-common.svelte';
	import { dedicatedCards } from '$lib/contents/enterprise';
	import CardSmall from '$lib/components/card/card-small.svelte';
</script>

<OpenGraph
	data={{
		description:
			'Install a private, single-tenant instance of Gitpod on your cloud account. Gitpod Dedicated is our alternative to self-hosting for large teams',
		title: 'Gitpod self-hosted alternative',
		keywords:
			'dedicated, self-hosted, private SaaS, single-tenant, installation',
	}}
/>

<Section class="text-center">
	<h2 class="text-5xl font-bold">Gitpod self-hosted alternative</h2>
	<p class="text-lg sm:text-2xl mt-micro mb-x-small mx-auto max-w-4xl">
		Run Gitpod in your own Cloud account with Gitpod Dedicated, our
		self-hosted alternative for large teams.
	</p>
	<LinkButton
		href="#dedicated-request-access"
		text="Request early access"
		variant="primary"
		size="large"
		data-analytics={`{"context":"self-hosted"}`}
	/>
</Section>

<Section>
	<Features features={dedicatedFeatures} />
</Section>

<SectionCommon
	title="Run Gitpod in your cloud account"
	text="Gitpod Dedicated is an isolated, single-tenant installation managed by Gitpod."
>
	<div
		class="flex flex-wrap justify-center mt-small max-w-8xl mx-auto"
		slot="content"
	>
		{#each dedicatedCards as card}
			<CardSmall
				class="m-macro px-xx-small relative"
				card={card.card}
				titleClassNames="h5"
			/>
		{/each}
	</div>
</SectionCommon>

<Section>
	<Testimonials
		title="Trusted by the best developer teams"
		text=" "
		class="-mb-20"
		{testimonials}
	/>
</Section>

<Section class="flex flex-col lg:flex-row" id="dedicated-request-access">
	<div
		class="max-w-4xl flex lgx:items-start flex-col items-center text-center lgx:text-left mb-8 m-auto lg:mr-auto lg:my-auto lg:m-0"
	>
		<h2 class="h3 !mb-micro md:!mb-x-small">Get started</h2>
		<div class="max-w-[460px] text-p-large">
			<p class="">
				Complete this form to join our limited availability waitlist.
			</p>
			<br />
			<ul class="pl-xx-small list-disc">
				<li>
					Dedicated is a fully isolated, private installation of
					Gitpod that meets complex compliance standards.
				</li>
				<br />
				<li>
					Gitpod teams fully manage your instance to ensure you're
					always working on the latest version.
				</li>
			</ul>
		</div>
	</div>
	<div class="max-w-2xl justify-center">
		<Signup class="lgx:hidden mx-auto" toType="dedicated-signup" />
	</div>
	<Signup toType="dedicated-signup" class="hidden lgx:block" />
</Section>
