/**
 * Escapes special characters in a string so it can be used safely
 * within a Regular Expression constructor.
 * * WHY: Characters like '.', '*', and '+' have special meanings in Regex.
 * If a user searches for "Hello?", we want to match the literal question mark,
 * not use the "?" as a regex quantifier.
 */
export const escapeRegex = (string: string) => {
  // \$& refers to the entire matched string (the special character found)
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Creates a case-insensitive regular expression that allows for
 * "fuzzy" matching between multiple string segments.
 * * WHY: This is useful for searching where the user might not know
 * the exact full string, but knows fragments (e.g., matching "John Smith"
 * with "John" and "Smith"). The ".*" allows any characters to exist
 * between the provided parts.
 */
export const createFuzzyMatcher = (parts: (string | undefined | null)[]) => {
  const pattern = parts
    .filter(Boolean) // Remove null or undefined segments
    .map((part) => escapeRegex(part)) // Escape special chars in each part
    .join(".*"); // Insert "wildcard" (any character) between parts

  return new RegExp(pattern, "i"); // 'i' flag makes the search case-insensitive
};

/**
 * Converts a date string from US format (MM/DD/YYYY) to ISO format (YYYY-MM-DD).
 * * WHY: Legacy systems (like Sierra) often provide dates in localized formats,
 * but modern databases and JavaScript's `Date` object are more reliable
 * and sortable when using the ISO 8601 format. PadStart ensures single-digit
 * months/days (like "1") become "01".
 */
export const formatSierraDate = (dateStr: string): string => {
  const parts = dateStr.split("/");

  if (parts.length !== 3) {
    throw new Error(
      `Invalid date format for Sierra: "${dateStr}". Expected MM/DD/YYYY.`
    );
  }

  const [month, day, year] = parts;
  // Transforms "12/31/2023" -> "2023-12-31"
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
