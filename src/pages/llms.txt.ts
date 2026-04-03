import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostUrl, getPublishedPosts, getPostReadingTime } from "../lib/blog";

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://fole.dev");
  const posts = getPublishedPosts(await getCollection("blog"));

  const postLines = posts
    .map((post) => {
      const url = getPostUrl(post, base);
      const mins = getPostReadingTime(post);
      return `- [${post.data.title}](${url}) (${mins} min read)`;
    })
    .join("\n");

  const body = `# Andrej Focic

## Identity
- Name: Andrej Focic
- Location: Dublin, Ireland
- Role: Founder & Engineer at intrebit
- Email: andrej@fole.dev
- Site: https://fole.dev

## Focus
Solo founder building intrebit. Full-stack product development from database to deploy. Currently exploring agentic engineering, LLM tooling, and AI-assisted development workflows.

## Blog Posts
${postLines || "No published posts yet."}

## Links
- GitHub: https://github.com/anfocic
- LinkedIn: https://www.linkedin.com/in/afocic/
- DEV: https://dev.to/fole
- RSS: https://fole.dev/rss.xml
- Full content: https://fole.dev/llms-full.txt

## Open to
Collaboration, open source, and conversations about agentic engineering and full-stack development.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
