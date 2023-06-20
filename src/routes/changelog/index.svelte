<script lang="ts" context="module">
  export const prerender = true;
  export const load: Load = async ({ fetch }) => {
    const res = await fetch("/api/changelogs");
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const changelogEntries = await res.json();
    return { props: { changelogEntries } };
  };
</script>

<script lang="ts">
  import type { ChangelogEntry as ChangelogEntryType } from "$lib/types/changelog-entry";

  import OpenGraph from "$lib/components/open-graph.svelte";
  import "$lib/assets/markdown-commons.scss";
  import TwitterFollowButton from "$lib/components/t-button.svelte";
  import { formatDate, stringToBeautifiedFragment } from "$lib/utils/helpers";
  import ChangelogDate from "$lib/components/changelog/changelog-date.svelte";
  import ChangelogLink from "$lib/components/changelog/changelog-link.svelte";
  import Wrapper from "$lib/components/changelog/wrapper.svelte";
  import Header from "$lib/components/header.svelte";
  import LinkButton from "$lib/components/ui-library/link-button";
  import ButtonsWrapper from "$lib/components/buttons-wrapper.svelte";
  import type { Load } from "@sveltejs/kit";
  import RSS from "$lib/components/svgs/rss.svelte";

  export let changelogEntries: ChangelogEntryType[];
</script>

<svelte:head>
  <link rel="stylesheet" href="/prism-solarized-light.min.css" />
</svelte:head>

<OpenGraph
  data={{
    description:
      "A sum-up of Gitpod’s latest product improvements, feature releases and community contributions.",
    title: "Gitpod Changelog - Latest releases and product updates",
    type: "website",
    keywords:
      "updates, product, changes, features, releases, bugs, fixes, version, updates, improvements",
    // Update this each monthly release and enter the changelog URL into https://cards-dev.twitter.com/validator to force twitter to refresh it
    image: "images/changelog/timeouts.webp",
    imageTwitter: "images/changelog/timeouts.webp",
  }}
/>

<div class="flex">
  <div class="hidden w-4/12 flex-shrink-0 md:block" />
  <Header
    centered={false}
    title="Changelog"
    text="Gitpod’s latest product improvements, feature releases and community contributions."
    class="w-full pb-x-small"
    textAlign="left"
  >
    <ButtonsWrapper slot="content" class="pt-x-small">
      <LinkButton
        target="_blank"
        data-analytics={`{"context":"dashboard"}`}
        href="https://gitpod.io/notifications"
        variant="primary"
        size="medium">Signup for the newsletter</LinkButton
      >
      <LinkButton
        target="_blank"
        data-analytics={`{"context":"changelog"}`}
        href="https://gitpod.io/changelog/rss.xml"
        variant="secondary"
        size="medium"
        ><RSS class="inline-block my-0 mx-1 h-4 w-4" />Subscribe to RSS</LinkButton
      >
      <TwitterFollowButton variant="cta" />
    </ButtonsWrapper>
  </Header>
</div>

<div
  class="flex flex-col space-y-x-large md:space-y-xxx-large divide-y divide-divider pt-x-large md:pt-xx-large border-y border-divider"
>
  {#each changelogEntries as { date, title, content, image, alt, customSlug }, i}
    <div
      class="changelog-entry flex flex-col md:flex-row last:pb-x-large md:last:pb-xxx-large {i !==
        0 &&
        i !== changelogEntries.length &&
        'pt-x-large md:pt-xxx-large'}"
    >
      <ChangelogDate
        date={formatDate(date)}
        href={`/changelog/${stringToBeautifiedFragment(
          customSlug ? customSlug : title
        )}`}
      />
      <Wrapper class="content-changelog w-full md:w-8/12">
        <img
          src="/images/changelog/{image}"
          class="rounded-3xl"
          width="800"
          height="435"
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          {alt}
        />
        <h2>
          <ChangelogLink
            href={`/changelog/${stringToBeautifiedFragment(
              customSlug ? customSlug : title
            )}`}
          >
            {title}
          </ChangelogLink>
        </h2>
        {@html content}
      </Wrapper>
    </div>
  {/each}
</div>
