import fs from "node:fs/promises";
import path from "node:path";
import {
  assetRootDir,
  contentDir,
  fileExists,
  projectRoot,
  slugify,
  templatePath,
  today,
} from "./blog-authoring.mjs";

function printUsage() {
  console.log('Usage: npm run new-post -- "Post Title"');
}

const args = process.argv.slice(2);
const title = args.join(" ").trim();

if (!title || args.includes("--help") || args.includes("-h")) {
  printUsage();
  process.exit(title ? 0 : 1);
}

const slug = slugify(title);
const filePath = path.join(contentDir, `${slug}.md`);
const assetDir = path.join(assetRootDir, slug);

if (await fileExists(filePath)) {
  console.error(`Post already exists: ${path.relative(projectRoot, filePath)}`);
  process.exit(1);
}

const template = await fs.readFile(templatePath, "utf8");
const documentText = template
  .replaceAll("{{TITLE}}", JSON.stringify(title))
  .replaceAll("{{DATE}}", today())
  .replaceAll("{{SLUG}}", slug);

await fs.mkdir(contentDir, { recursive: true });
await fs.mkdir(assetDir, { recursive: true });
await fs.writeFile(filePath, documentText, "utf8");

console.log(`Created ${path.relative(projectRoot, filePath)}`);
console.log(`Preview at /blog/${slug}/ once \`npm run dev\` is running.`);
console.log(`Assets can go in ${path.relative(projectRoot, assetDir)}/`);
console.log(`Publish later with: npm run publish -- ${slug}`);
