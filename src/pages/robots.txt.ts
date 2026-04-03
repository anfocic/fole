import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = site ? new URL("/sitemap.xml", site).toString() : "/sitemap.xml";
  const llmsUrl = site ? new URL("/llms.txt", site).toString() : "/llms.txt";
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n\n# LLM content\n# ${llmsUrl}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
