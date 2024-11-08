export const displayName = (
  locale: string,
  koreanName?: string,
  englishName?: string,
) => locale === "ko" ? koreanName : englishName ?? koreanName;