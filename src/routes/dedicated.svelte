<script context="module">
  export const prerender = true;
</script>

<script lang="ts">
  import Signup from "$lib/components/dedicated/signup.svelte";
  import OpenGraph from "$lib/components/open-graph.svelte";
  import Hero from "$lib/components/dedicated/hero-text.svelte";
  import { dedicatedPageFeatures } from "$lib/contents/home/features";
  import SectionFeatures from "$lib/components/section-features.svelte";
  import Explore from "$lib/components/explore.svelte";
</script>

<OpenGraph
  data={{
    title: "Gitpod Dedicated: an isolated, single-tenant installation",
    keywords: "dedicated, single-tenant, isolated, managed, private",
    description:
      "Get your private instance of Gitpod. Gitpod Dedicated is the right choice for large companies with high security and compliance requirements.",
  }}
/>

<div
  class="flex flex-wrap justify-center lgx:justify-start items-start mb-xxx-large place-items-center"
>
  <div class="max-w-2xl justify-left pt-0 md:pt-large">
    <Hero />
  </div>
  <div class="max-w-2xl justify-center" id="dedicated-signup">
    <Signup class="lgx:hidden mx-auto" toType="dedicated-signup" />
  </div>
  <Signup toType="dedicated-signup" class="hidden lgx:block mt-x-large" />
</div>

<SectionFeatures
  title="Run Gitpod in your cloud account"
  features={dedicatedPageFeatures}
/>

<Explore
  contents={{
    title: "Try Gitpod Dedicated",
    description:
      "Maximum control and security of your dev environments - best for large teams.",
    link: {
      href: "#dedicated-signup",
      text: "Request early access",
    },
  }}
/>
