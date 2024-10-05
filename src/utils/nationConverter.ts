export function nationConverter(nation: string | null) {
  const nationMap = {
    "ko": "Korea",
    "en": "United States",
    "zhCN": "China",
    "zhTW": "Taiwan",
    "de": "Germany",
    "id": "Indonesia",
    "ja": "Japan",
    "fr": "France",
    "es": "Spain",
    "vi": "Vietnam",
    "ms": "Malaysia",
    "th": "Thailand",
    "all": "All"
  };

  return nationMap[nation as keyof typeof nationMap];
}

export function nationConverterToKr(nation: string) {
  const nationMap = {
    "ko": "대한민국",
    "en": "미국",
    "zhCN": "중국",
    "zhTW": "대만",
    "de": "독일",
    "id": "인도네시아",
    "ja": "일본",
    "fr": "프랑스",
    "es": "스페인",
    "vi": "베트남",
    "ms": "말레이시아",
    "th": "태국",
    "all": "전체"
  };

  return nationMap[nation as keyof typeof nationMap];
}