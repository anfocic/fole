import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostPath, getPublishedPosts } from "../lib/blog";

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
    throw new Error("Sitemap generation requires the `site` option in astro.config.mjs.");
  }

  const posts = getPublishedPosts(await getCollection("blog"));
  const urls = [
    { path: "/", lastmod: undefined },
    { path: "/blog/", lastmod: undefined },
    ...posts.map((post) => ({
      path: getPostPath(post),
      lastmod: (post.data.updatedDate ?? post.data.date).toISOString(),
    })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(({ path, lastmod }) => {
      const lines = [
        "  <url>",
        `    <loc>${escapeXml(new URL(path, site).toString())}</loc>`,
      ];

      if (lastmod) {
        lines.push(`    <lastmod>${lastmod}</lastmod>`);
      }

      lines.push("  </url>");
      return lines.join("\n");
    }),
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
