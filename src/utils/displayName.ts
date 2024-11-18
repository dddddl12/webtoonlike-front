export function displayName(
  locale: string,
  koreanName: string,
  englishName?: string,
): string;
export function displayName(
  locale: string,
  koreanName?: string,
  englishName?: string,
): string | undefined;
export function displayName(
  locale: string,
  koreanName?: string,
  englishName?: string,
) {
  return locale === "ko" ? koreanName : englishName ?? koreanName;
}