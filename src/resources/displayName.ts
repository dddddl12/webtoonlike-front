import "server-only";

export function displayName(
  locale: string,
  koreanName: string,
  englishName?: string | null,
): string;
export function displayName(
  locale: string,
  koreanName?: string | null,
  englishName?: string | null,
): string | undefined;
export function displayName(
  locale: string,
  koreanName?: string | null,
  englishName?: string | null,
): string | undefined {
  return (locale === "ko" ? koreanName : englishName ?? koreanName)
    ?? undefined;
}