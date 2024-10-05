export function businessFieldConverterToKr(nation: string) {
  const nationMap = {
    "all": "전체",
    "webtoon": "웹툰",
    "movie": "영화",
    "drama": "드라마",
    "webDrama": "웹드라마",
    "ads": "광고",
    "musical": "뮤지컬",
    "game": "게임",
    "book": "도서",
    "product": "상품"
  };

  return nationMap[nation as keyof typeof nationMap];
}

export function businessFieldConverterToEn(nation: string | null) {
  const nationMap = {
    "all": "all",
    "webtoon": "webtoon",
    "movie": "movie",
    "drama": "drama",
    "webDrama": "webDrama",
    "ads": "ads",
    "musical": "musical",
    "game": "game",
    "book": "book",
    "product": "product"
  };

  return nationMap[nation as keyof typeof nationMap];
}
