// lib/utils/language.ts

/**
 * Language detection utilities
 */

/**
 * Detects if the given text is primarily in English.
 * Uses a combination of Unicode range detection and common English patterns.
 * 
 * @param text - The text to analyze
 * @returns true if the text appears to be in English, false otherwise
 */
export function isEnglish(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return true; // Consider empty text as English to avoid filtering
  }

  const trimmedText = text.trim();
  
  // Check for non-Latin characters (CJK, Arabic, Cyrillic, etc.)
  // If more than 5% of the text is non-Latin, it's likely not English
  const nonLatinRegex = /[\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u1100-\u11FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/g;
  const nonLatinMatches = trimmedText.match(nonLatinRegex);
  const nonLatinRatio = nonLatinMatches ? nonLatinMatches.length / trimmedText.length : 0;
  
  if (nonLatinRatio > 0.05) {
    return false;
  }

  // Check for extended Latin characters that are uncommon in English
  // (e.g., accented characters used in other European languages)
  const extendedLatinRegex = /[À-ÖØ-öø-ÿ]/g;
  const extendedLatinMatches = trimmedText.match(extendedLatinRegex);
  const extendedLatinRatio = extendedLatinMatches ? extendedLatinMatches.length / trimmedText.length : 0;
  
  // If more than 10% has extended Latin, it's likely not English
  if (extendedLatinRatio > 0.1) {
    return false;
  }

  // If we made it this far, the text is primarily basic Latin characters
  // which is a strong indicator of English
  return true;
}

/**
 * Checks if a search result title is in English
 * 
 * @param title - The search result title
 * @returns true if the title is in English, false otherwise
 */
export function isResultTitleEnglish(title: string): boolean {
  return isEnglish(title);
}
