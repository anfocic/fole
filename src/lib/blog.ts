import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

function sortPosts(posts: BlogPost[]) {
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getPublishedPosts(posts: BlogPost[]) {
  return sortPosts(posts.filter((post) => !post.data.draft));
}

export function getBlogPosts(
  posts: BlogPost[],
  options: { includeDrafts?: boolean } = {},
) {
  const { includeDrafts = false } = options;
  return sortPosts(posts.filter((post) => includeDrafts || !post.data.draft));
}

export function getPostSlug(post: BlogPost) {
  return (post.data.slug ?? post.id).replace(/^\/+|\/+$/g, "");
}

export function getPostPath(post: BlogPost) {
  return `/blog/${getPostSlug(post)}/`;
}

export function getPostUrl(post: BlogPost, site: URL) {
  return new URL(getPostPath(post), site).toString();
}

export function getReadingTime(text: string, wordsPerMinute = 200) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getPostReadingTime(post: BlogPost) {
  return getReadingTime(post.body ?? "");
}
