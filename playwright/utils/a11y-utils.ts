export const A11Y_GUIDELINES = ["wcag21aa", "wcag22aa"] as const;

export function validateA11yCoverage(results) {
  const analyzedTags = new Set([
    ...results.passes.flatMap((r) => r.tags),
    ...results.violations.flatMap((r) => r.tags),
    ...results.inapplicable.flatMap((r) => r.tags),
  ]);

  for (const guideline of A11Y_GUIDELINES) {
    if (!analyzedTags.has(guideline)) {
      throw new Error(`CRITICAL: The ${guideline} audit was not executed.`);
    }
  }
}
