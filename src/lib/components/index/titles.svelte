<script lang="ts">
	import FeatureTitles from '../feature-titles.svelte';
	import Section from '../section.svelte';
	import { featureTitles } from '$lib/contents/home/index';
</script>

<Section>
	<FeatureTitles
		{featureTitles}
		featureTitlePadding="px-macro py-xx-small sm:px-small sm:py-x-small"
	/>
</Section>
