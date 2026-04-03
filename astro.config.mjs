// @ts-check
import { defineConfig } from 'astro/config';
import icon from "astro-icon";

// https://astro.build/config
const site = process.env.SITE_URL ?? "https://fole.dev";

export default defineConfig({
  site,
  integrations: [icon()],
});
