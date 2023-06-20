<script lang="ts">
  import { getFeatureFlag } from "$lib/utils/feature-flag-provider";
  import Section from "../../section.svelte";
  import LaunchExampleWorkspace from "./launch-example-workspace.svelte";
  import LinkGitRepository from "./link-git-repository.svelte";
  import Card from "$lib/components/ui-library/card";
  import { trackEvent } from "$lib/components/segment.svelte";
  import { onMount } from "svelte";

  let exampleFlagValue = null;
  onMount(async () => {
    getFeatureFlag("home_example_launch_workspaces_card", false, (val) => {
      exampleFlagValue = val;
      trackEvent("component_loaded", {
        experiments_variant: exampleFlagValue
          ? "git_signup_cta_with_examples_loaded"
          : "git_signup_cta_without_examples_loaded",
      });
    });
  });
</script>

<Section id="get-started" class="pt-20">
  <h2 class="!mb-x-small text-center text-h2">Get started with any project</h2>
  <div
    class="cards-container flex flex-col lg:flex-row {exampleFlagValue
      ? 'max-w-6xl'
      : 'max-w-5xl'}  gap-4 mx-auto"
    class:justify-between={exampleFlagValue}
    class:justify-center={!exampleFlagValue}
  >
    <Card
      class="p-xx-small sm:py-small basis-[50%] sm:px-x-small xl:p-medium text-center"
      size="small"
    >
      <LinkGitRepository {exampleFlagValue} />
    </Card>

    {#if exampleFlagValue}
      <Card
        class="p-xx-small sm:py-small basis-[50%] sm:px-x-small xl:p-medium text-center"
        size="small"
      >
        <LaunchExampleWorkspace />
      </Card>
    {/if}
  </div>
</Section>
