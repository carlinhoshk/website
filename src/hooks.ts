// import type { Handle } from "@sveltejs/kit";
// import * as cookie from "cookie";
import { sequence } from "@sveltejs/kit/hooks";
import { compile } from "mdsvex";
import { basename } from "path";

// This function fetches changelog entries from the /src/lib/contents/changelog/ directory
// and adds them to the event.locals object. It also orders them by date.

const handleChangelogEntries = async ({ event, resolve }) => {
  try {
    // Get all the changelog entries from the glob.
    const changelogEntries = await Promise.all(
      Object.entries(import.meta.glob("/src/lib/contents/changelog/*.md"))
        // Filter out the template.
        .filter(([path]) => !path.endsWith("_template.md"))
        // Convert each entry into metadata.
        .map(async ([path, mod]) => {
          // Get the content and metadata from the module.
          const { default: content, metadata } = (await mod()) as any;
          // Get the file name from the path.
          const fileName = basename(path);
          // Compile the excerpt.
          const excerpt = await compile(metadata.excerpt);
          // Return the metadata with the compiled excerpt and the rendered content.
          return {
            ...metadata,
            excerpt: excerpt.code.trim(),
            content: content.render().html,
            fileName,
          };
        })
    );
    // Sort the changelog entries by date.
    changelogEntries.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    // Pass the changelog entries to the next handler.
    event.locals.changelogEntries = changelogEntries;
    // Pass the event to the next handler.
    return await resolve(event);
  } catch (error) {
    // If there was an error, log it.
    console.error(error);
    // Return a response with the error.
    return new Response(`Internal Server Error\n ${error.message}`, {
      status: 500,
    });
  }
};

const handleHeaders = async ({ event, resolve }) => {
  const response = await resolve(event);
  // Avoid clickjacking attacks, see https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html
  response.headers.set(
    "Content-Security-Policy",
    "frame-ancestors *.gitpod.cloud *.gitpod.io *.staging.gitpod-dev.com;"
  );
  return response;
};

export const handle = sequence(handleHeaders, handleChangelogEntries);
