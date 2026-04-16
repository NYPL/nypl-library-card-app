import { expect, type Page } from "@playwright/test";

export const A11Y_GUIDELINES = ["wcag21aa", "wcag22aa"] as const;

type A11yResultGroup = { tags: string[] };
type A11yResults = {
  passes: A11yResultGroup[];
  violations: A11yResultGroup[];
  inapplicable: A11yResultGroup[];
};

// Fails if required WCAG tags were not exercised by the axe run
export function validateA11yCoverage(results: A11yResults) {
  const analyzedTags = new Set([
    ...results.passes.flatMap((r) => r.tags),
    ...results.violations.flatMap((r) => r.tags),
    ...results.inapplicable.flatMap((r) => r.tags),
  ]);

  for (const guideline of A11Y_GUIDELINES) {
    expect(analyzedTags.has(guideline)).toBe(true);
  }
}

export async function pressTab(page: Page, browserName: string) {
  // Check if we are on WebKit AND on a Mac
  const isMacWebKit = browserName === "webkit";

  if (isMacWebKit) {
    // Simulates Option+Tab on macOS to ensure links/buttons are focused
    await page.keyboard.press("Alt+Tab");
  } else {
    // Standard Tab for Chrome, Firefox, and WebKit on Linux/Windows
    await page.keyboard.press("Tab");
  }
}
