import type { ChangelogEntry as ChangelogEntryType } from "$lib/types/changelog-entry";

export const GET: import("@sveltejs/kit").RequestHandler = async ({
  locals,
}) => {
  const { fileName } = (locals.changelogEntries as ChangelogEntryType[]).find(
    (e) => {
      return e.tag && e.tag.indexOf("rollup") != -1;
    }
  );
  return {
    headers: {
      "Cache-Control": "public, max-age=600",
    },
    body: {
      releaseId: fileName.replace(".md", ""),
    },
  };
};
