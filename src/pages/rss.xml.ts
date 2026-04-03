import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostUrl, getPublishedPosts } from "../lib/blog";

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return character;
    }
  });
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("RSS generation requires the `site` option in astro.config.mjs.");
  }

  const posts = getPublishedPosts(await getCollection("blog"));
  const items = posts
    .map((post) => {
      const url = getPostUrl(post, site);

      return [
        "<item>",
        `  <title>${escapeXml(post.data.title)}</title>`,
        `  <description>${escapeXml(post.data.description)}</description>`,
        `  <link>${url}</link>`,
        `  <guid isPermaLink="true">${url}</guid>`,
        `  <pubDate>${post.data.date.toUTCString()}</pubDate>`,
        "</item>",
      ].join("\n");
    })
    .join("\n");

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>Andrej Focic</title>",
    "    <description>Thoughts on development, building, and more.</description>",
    `    <link>${new URL("/", site).toString()}</link>`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    "    <language>en</language>",
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
