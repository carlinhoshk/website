<script lang="ts">
	import Body from '$lib/components/screencasts/body.svelte';
	import GetStartedSmall from '$lib/components/screencasts/get-started-small.svelte';
	import { demoScreencast } from '$lib/contents/screencasts';
	import MoreArticles from '$lib/components/more-articles.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Body
	title="Gitpod's developer platform"
	description="Watch a short demo of Gitpod CDEs to learn how to developer faster <br/> and more securely."
	screencast={demoScreencast}
	hideDescription={true}
>
	<div slot="custom">
		<h2 class="h5 mt-micro mb-2">Gitpod Demo</h2>
		<p class="max-w-xl">
			See how Gitpod launches a ready-to-code project built on five
			containers using a Node app, .NET app, a Python app as well as Redis
			and Postgres databases with a simple click.
		</p>

		<div class="flex flex-row my-xx-small items-center space-x-2">
			<p class="text-important font-bold text-md md:text-xl">
				Try it yourself:
			</p>
			<a
				href="https://gitpod.io/#https://github.com/gitpod-io/voting-app"
				target="_blank"
				data-analytics={`{"context":"screencast_page"}`}
				><img
					src="/svg/open-in-gitpod.svg"
					alt="Open in Gitpod"
					class="h-3/4 md:h-full w-3/4 md:w-full"
				/></a
			>
		</div>
	</div>
</Body>

<div class="mt-x-large md:mt-xxx-large">
	<GetStartedSmall />
	<p class="mt-6 md:mb-24 max-w-full mx-auto text-center text-base">
		Do you still have questions? Please <a href="/contact/sales"
			>Contact sales</a
		>.
	</p>
</div>

<MoreArticles
	title="Helpful resources"
	posts={[
		...data.posts,
		{
			title: 'Gitpodifying — The Ultimate Guide',
			excerpt:
				'I recently stumbled upon a new project on GitHub that peaked my interest. It proposed a new type of database that I was dying to try out.',
			teaserImage: '/images/guides/gitpodify/teaser.jpg',
			image: '/images/guides/gitpodify/teaser.jpg',
			href: '/guides/gitpodify',
			isNotAnActualPost: true,
			headings: [],
		},
	]}
/>
