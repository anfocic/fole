import fs from "node:fs/promises";
import path from "node:path";
import {
  buildDocument,
  extractFrontmatter,
  projectRoot,
  readFrontmatterValue,
  resolvePostFile,
  updateFrontmatterValue,
} from "./blog-authoring.mjs";

function printUsage() {
  console.log("Usage: npm run publish -- <slug-or-file>");
}

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith("-"));
const showHelp = args.includes("--help") || args.includes("-h");

if (!target || showHelp) {
  printUsage();
  process.exit(showHelp ? 0 : 1);
}

const filePath = await resolvePostFile(target);
const documentText = await fs.readFile(filePath, "utf8");
const { frontmatter, body } = extractFrontmatter(documentText);

if (readFrontmatterValue(frontmatter, "draft") === "false") {
  console.log(`${path.relative(projectRoot, filePath)} is already published.`);
  process.exit(0);
}

const nextFrontmatter = updateFrontmatterValue(frontmatter, "draft", "false", {
  insertAfter: ["date"],
});
const nextDocumentText = buildDocument(nextFrontmatter, body);

await fs.writeFile(filePath, nextDocumentText, "utf8");

const slug = readFrontmatterValue(nextFrontmatter, "slug")
  ?? path.basename(filePath, ".md");
const description = readFrontmatterValue(nextFrontmatter, "description");

console.log(`Published ${path.relative(projectRoot, filePath)}`);
console.log(`Live path: /blog/${slug}/`);

if (!description) {
  console.log("Warning: description is still empty.");
}
