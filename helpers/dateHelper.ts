import { format, addDays } from "date-fns";

export function dateForMsg(): string {
  return format(new Date(), "MMM dd, yyyy");
}

export function getDateFromToday(offset: number) {
  return format(addDays(new Date(), offset), "yyyy-MM-dd");
}
