import type { ChangelogEntry } from "$lib/types/changelog-entry";
import { stringToBeautifiedFragment } from "$lib/utils/helpers";
import RSS from "rss";

export const GET: import("@sveltejs/kit").RequestHandler = async ({
  locals,
}) => {
  const ttlInMin = 60;

  const feed = new RSS({
    title: "Gitpod Changelog",
    description: "New features and improvements to Gitpod.",
    copyright: `${new Date().getFullYear()} Gitpod GmbH. All rights reserved`,
    ttl: ttlInMin,
    feed_url: "https://www.gitpod.io/changelog",
    site_url: "https://www.gitpod.io/",
    image_url: "https://www.gitpod.io/favicon192.png",
    language: "en",
    pubDate: new Date(locals.changelogEntries[0].date).toUTCString(),
    generator: "Gitpod",
  });

  locals.changelogEntries.forEach((entry: ChangelogEntry) => {
    feed.item({
      title: entry.title,
      description: entry.content.replace(
        /src="\//g,
        'src="https://www.gitpod.io/'
      ),
      date: entry.date,
      url: `https://www.gitpod.io/changelog/${stringToBeautifiedFragment(
        entry.customSlug ? entry.customSlug : entry.title
      )}`,
      guid: `https://www.gitpod.io/changelog/${stringToBeautifiedFragment(
        entry.customSlug ? entry.customSlug : entry.title
      )}`,
      enclosure: {
        url: `https://www.gitpod.io/images/changelog/${entry.image}`,
        type: "image/webp",
      },
      author: "Gitpod",
    });
  });

  return {
    headers: {
      "Cache-Control": `max-age=0, s-max-age=${ttlInMin * 60}`,
      "Content-Type": "application/xml",
    },
    body: feed.xml(),
  };
};
