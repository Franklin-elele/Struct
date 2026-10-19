const MS_PER_DAY = 86400000;
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function getDayNumber(startDate: string) {
  const days = Math.floor(
    (startOfDay(new Date()) - startOfDay(new Date(startDate))) / MS_PER_DAY,
  );
  return Math.min(90, Math.max(1, days + 1));
}

export function getDaysRemaining(endDate: string) {
  return Math.max(
    0,
    Math.round((startOfDay(new Date(endDate)) - startOfDay(new Date())) / MS_PER_DAY),
  );
}