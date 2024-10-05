import { format as dfFormat } from "date-fns";

export function convertTimeAbsolute(dateString: Date|string): string {
  const date = new Date(dateString);
  // // 1/1 00:00
  // return dfFormat(date, "M/d HH:mm");
  // 2024.02.22
  return dfFormat(date, "yyyy.MM.dd");
}
