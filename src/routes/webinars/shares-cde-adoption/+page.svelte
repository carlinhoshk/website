<script>
	import InThisWebinar from '$lib/components/webinars/in-this-webinar.svelte';
	import OrganizedBy from '$lib/components/webinars/organized-by.svelte';
	import gitpodSvelte from '$lib/components/svgs/brands/gitpod.svelte';
	import Register from '$lib/components/webinars/register.svelte';
	import Layout from '$lib/components/webinars/layout.svelte';
	import Header from '$lib/components/webinars/header.svelte';
	import OpenGraph from '$lib/components/open-graph.svelte';
	import Hosts from '$lib/components/webinars/hosts.svelte';
	import SharesLogo from './SharesLogo.svelte';

	const description =
		"CDEs are on-demand development environments that are pre-configured with all tools, libraries and dependencies needed to write and review code.\n\nIn this webinar series, join some of Gitpod’s customers who will share their stories on CDE adoption in their companies. First up we'll be talking to Shares.io where all their engineers are using Gitpod as a default way of development, benefitting from massive productivity gains with every future hire embarking on the same journey.";
</script>

<OpenGraph
	data={{
		title: 'How developers save half a day per week with CDEs',
		description,
		keywords:
			'cloud development environment, cde, devx, developer experience, gitpod',
		image: 'images/webinars/shares-cde-adoption.webp',
		imageTwitter: 'images/webinars/shares-cde-adoption.webp',
	}}
/>

<div class="flex items-start">
	<Layout>
		<Header
			title="How developers save half a day per week with CDEs"
			label="Webinar"
			date="27th July 2023 - 5:30 PM CET"
			duration="30min"
			webinarDescription={description}
		/>

		<Register
			toType="shares-cde-adoption"
			class="lgx:hidden"
			eventType="webinar"
		/>

		<div class="max-w-[560px]">
			<InThisWebinar>
				<svelte:fragment slot="list-items">
					<li>How Shares adopted CDEs into their organisation</li>
					<li>
						The benefits of moving your development team to use CDEs
					</li>
				</svelte:fragment>
			</InThisWebinar>

			<Hosts
				hosts={[
					{
						avatar: {
							src: '/images/webinars/francois.webp',
						},
						name: 'François Ruty',
						jobTitle: 'CTO & Cofounder at Shares',
						companyLogo: {
							component: SharesLogo,
						},
						text: 'Aerospace engineer by training, software engineer by trade. Always coding on the field with the crews, always learning',
					},
					{
						avatar: {
							src: '/images/webinars/pauline.webp',
						},
						name: 'Pauline Narvas',
						jobTitle: 'Head of Community at Gitpod',
						companyLogo: {
							component: gitpodSvelte,
							props: {
								class: 'h-6',
							},
						},
						text: 'When Pauline is not building community, she likes to share her thoughts on her tech journey, personal development, health and well-being on her blog and on Twitter.',
					},
				]}
			/>

			<OrganizedBy>
				<img
					src="/images/gitpod-logo.svg"
					alt="Gitpod"
					class="h-10 w-10"
				/>
			</OrganizedBy>
		</div>
	</Layout>

	<Register
		toType="shares-cde-adoption"
		class="hidden lgx:block"
		eventType="webinar"
	/>
</div>
