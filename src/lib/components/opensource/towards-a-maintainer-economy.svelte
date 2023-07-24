<script lang="ts">
	import MoreArticles from '../more-articles.svelte';
	import type { BlogPost } from '$lib/types/blog';

	export let posts: BlogPost[];
</script>

<MoreArticles
	title="Towards a maintainer economy"
	text="Gitpod supports the high achievers that our digital society is built upon."
	{posts}
/>
