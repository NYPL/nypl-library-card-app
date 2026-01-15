export const escapeRegex = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const createFuzzyMatcher = (parts: (string | undefined | null)[]) => {
  const pattern = parts
    .filter(Boolean)
    .map((part) => escapeRegex(part))
    .join(".*");
  return new RegExp(pattern, "i");
};

export const formatSierraDate = (dateStr: string): string => {
  const parts = dateStr.split("/");

  if (parts.length !== 3) {
    throw new Error(
      `Invalid date format for Sierra: "${dateStr}". Expected MM/DD/YYYY.`
    );
  }

  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
