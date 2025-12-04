import { playwrightTest } from "@axe-core/watcher";

const API_KEY = process.env.API_KEY;

const { test, expect } = playwrightTest({
  axe: {
    apiKey: API_KEY,
  },
  headless: false,
  // Any other Playwright configuration you’d pass to chromium.launchPersistentContext() here
});

export { test, expect };
