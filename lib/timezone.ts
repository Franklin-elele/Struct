import { DateTime, IANAZone } from "luxon";

export const DEFAULT_TIMEZONE = "UTC";

// True only for real zone names like "Africa/Lagos"
export const isValidZone = (zone?: unknown): zone is string =>
  typeof zone === "string" && IANAZone.isValidZone(zone);

// Falls back to UTC if the stored value is missing or invalid
export const safeZone = (zone?: string | null) =>
  isValidZone(zone) ? zone : DEFAULT_TIMEZONE;

// Today in the user's zone: start (inclusive), end (exclusive, = tomorrow's start), weekday name
export function getToday(zone?: string | null) {
  const start = DateTime.now().setZone(safeZone(zone)).startOf("day");
  const next = start.plus({ days: 1 }).startOf("day"); // handles daylight-saving days
  return {
    start: start.toJSDate(),
    end: next.toJSDate(),
    dayName: start.setLocale("en").toFormat("ccc"), // "Mon", "Tue"...
  };
}

// Start of the day N days ago, in the user's zone
export function getDayStartDaysAgo(zone: string | null | undefined, days: number) {
  return DateTime.now()
    .setZone(safeZone(zone))
    .startOf("day")
    .minus({ days })
    .startOf("day")
    .toJSDate();
}