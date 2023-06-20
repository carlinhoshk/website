import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
  const res = await fetch(`https://www.github.com/${params.slug}.png`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return {
    body: buffer,
    headers: {
      "Cache-Control": "public, max-age=604800",
      "Content-Type": res.headers.get("content-type"),
    },
  };
};
