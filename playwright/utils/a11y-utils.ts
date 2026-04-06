import { expect } from "@playwright/test";

export const A11Y_GUIDELINES = ["wcag21aa", "wcag22aa"] as const;

// Created: 04/01/26; Expires: 04/01/27
export const USED_USER_NAME = "tester";
export const AVAILABLE_USER_NAME = "testuser";

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
