import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostUrl, getPublishedPosts, getPostReadingTime } from "../lib/blog";

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://fole.dev");
  const posts = getPublishedPosts(await getCollection("blog"));

  const sections = posts
    .map((post) => {
      const url = getPostUrl(post, base);
      const mins = getPostReadingTime(post);
      const date = post.data.date.toISOString().split("T")[0];
      const tags = post.data.tags.length ? `Tags: ${post.data.tags.join(", ")}` : "";
      const series = post.data.series
        ? `Series: ${post.data.series}${post.data.seriesOrder ? ` #${post.data.seriesOrder}` : ""}`
        : "";
      const meta = [date, `${mins} min read`, tags, series].filter(Boolean).join(" | ");

      return `---
## ${post.data.title}
${meta}
URL: ${url}

${post.body ?? ""}`;
    })
    .join("\n\n");

  const body = `# Andrej Focic — Full Blog Content

This file contains the full text of all published blog posts on fole.dev.
For a summary, see: https://fole.dev/llms.txt

${sections || "No published posts yet."}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
