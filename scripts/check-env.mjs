const required = [
  "PUBLIC_PLAUSIBLE_DOMAIN",
];

const missing = required.filter((k) => !process.env[k]);

if (missing.length) {
  console.error(`\nDeploy blocked — missing env vars:\n${missing.map((k) => `  ${k}`).join("\n")}\n`);
  process.exit(1);
}

console.log("Env check passed.");
