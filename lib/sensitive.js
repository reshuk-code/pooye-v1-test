const SENSITIVE_WORDS = [
  /\bfuck\b/i,
  /\bsex\b/i,
  /\bnudes?\b/i,
  /\bmilf\b/i,
  /\bsucie\b/i,
  /\bdeath\b/i,
  /\bporn\b/i,
];

export function isSensitive(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return SENSITIVE_WORDS.some((regex) => regex.test(lower));
}