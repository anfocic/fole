import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));

export const projectRoot = path.resolve(scriptsDir, "..");
export const contentDir = path.join(projectRoot, "src", "content", "blog");
export const templatePath = path.join(projectRoot, "templates", "blog-post.md");
export const assetRootDir = path.join(projectRoot, "public", "blog");

export function slugify(input) {
  const slug = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `post-${today()}`;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function listPostFiles(dir = contentDir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listPostFiles(entryPath);
      }

      return entry.name.endsWith(".md") ? [entryPath] : [];
    }),
  );

  return files.flat();
}

export function extractFrontmatter(documentText) {
  const match = documentText.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error("Post file is missing frontmatter.");
  }

  const [, frontmatter] = match;
  const body = documentText.slice(match[0].length).replace(/^\n*/, "");
  return { frontmatter, body };
}

export function buildDocument(frontmatter, body) {
  const normalizedBody = body.replace(/^\n*/, "");
  return `---\n${frontmatter.trimEnd()}\n---\n\n${normalizedBody}`;
}

export function readFrontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)\\s*$`, "m"));
  if (!match) {
    return undefined;
  }

  return stripQuotes(match[1].trim());
}

export function updateFrontmatterValue(
  frontmatter,
  key,
  value,
  options = {},
) {
  const line = `${key}: ${value}`;
  const matcher = new RegExp(`^${key}:\\s*.*$`, "m");

  if (matcher.test(frontmatter)) {
    return frontmatter.replace(matcher, line);
  }

  const lines = frontmatter.split("\n");
  const insertAfter = options.insertAfter ?? [];
  const index = lines.findIndex((existingLine) =>
    insertAfter.some((candidate) => existingLine.startsWith(`${candidate}:`)),
  );

  if (index === -1) {
    lines.push(line);
    return lines.join("\n");
  }

  lines.splice(index + 1, 0, line);
  return lines.join("\n");
}

export async function resolvePostFile(target) {
  const normalized = normalizeLookupTarget(target);
  const directPath = path.isAbsolute(target)
    ? target
    : path.join(projectRoot, target);

  if (await fileExists(directPath)) {
    return directPath;
  }

  const files = await listPostFiles();
  const matches = [];

  for (const filePath of files) {
    const documentText = await fs.readFile(filePath, "utf8");
    const { frontmatter } = extractFrontmatter(documentText);
    const relativePath = path.relative(contentDir, filePath).replace(/\\/g, "/");
    const fileSlug = relativePath.replace(/\.md$/, "");
    const customSlug = readFrontmatterValue(frontmatter, "slug");
    const candidates = new Set([
      normalizeLookupTarget(relativePath),
      normalizeLookupTarget(fileSlug),
      normalizeLookupTarget(path.basename(relativePath, ".md")),
    ]);

    if (customSlug) {
      candidates.add(normalizeLookupTarget(customSlug));
      candidates.add(normalizeLookupTarget(`/blog/${customSlug}`));
    }

    if (candidates.has(normalized)) {
      matches.push(filePath);
    }
  }

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    const relativeMatches = matches
      .map((filePath) => path.relative(projectRoot, filePath))
      .join(", ");
    throw new Error(`Multiple posts matched "${target}": ${relativeMatches}`);
  }

  throw new Error(`Could not find a post matching "${target}".`);
}

export function normalizeLookupTarget(value) {
  return value
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\.\/+/, "")
    .replace(/^src\/content\/blog\//, "")
    .replace(/^\/blog\//, "")
    .replace(/\.md$/, "")
    .replace(/^\/+|\/+$/g, "");
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
