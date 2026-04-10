import type {
  EventOccurrence,
  EventOccurrenceRouteParams,
  OccurrenceExpansionOptions,
  WebsiteEventRecord,
  WeekdayKey,
  WixEventMigrationQaFinding,
} from "./model";

const DEFAULT_HORIZON_PAST_MONTHS = 3;
const DEFAULT_HORIZON_FUTURE_MONTHS = 18;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const WIX_EVENT_SLUG_DATE_PATTERN = /\/events\/[^/]+-(\d{4}-\d{2}-\d{2})(?:-\d{2}-\d{2})?(?:[/?#]|$)/;
const WEEKDAY_INDEX: Record<WeekdayKey, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
};

function parseDateKey(dateKey: string): Date {
  if (!ISO_DATE_PATTERN.test(dateKey)) {
    throw new Error(`Invalid date value "${dateKey}". Expected YYYY-MM-DD.`);
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));

  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    throw new Error(`Invalid calendar date "${dateKey}".`);
  }

  return candidate;
}

function formatDateKey(date: Date): string {
  const year = `${date.getUTCFullYear()}`;
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + amount);
  return next;
}

function addMonths(date: Date, amount: number): Date {
  const next = new Date(date.getTime());
  next.setUTCMonth(next.getUTCMonth() + amount);
  return next;
}

function compareDateKeys(left: string, right: string): number {
  return left.localeCompare(right);
}

function compareDateTimeKeys(
  leftDate: string,
  leftTime: string,
  rightDate: string,
  rightTime: string,
): number {
  return `${leftDate}T${leftTime}`.localeCompare(`${rightDate}T${rightTime}`);
}

function getWeekAnchor(date: Date): Date {
  const weekday = date.getUTCDay();
  const distanceToMonday = weekday === 0 ? 6 : weekday - 1;
  return addDays(date, -distanceToMonday);
}

function differenceInCalendarDays(startDate: Date, endDate: Date): number {
  return Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000);
}

function differenceInCalendarMonths(startDate: Date, endDate: Date): number {
  return (
    (endDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
    (endDate.getUTCMonth() - startDate.getUTCMonth())
  );
}

function isValidTimeValue(value: string): boolean {
  return ISO_TIME_PATTERN.test(value);
}

function getBerlinNowParts(referenceDate = new Date()): { dateKey: string; timeKey: string } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(referenceDate);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    dateKey: `${values.year}-${values.month}-${values.day}`,
    timeKey: `${values.hour}:${values.minute}`,
  };
}

export function getCurrentBerlinDateKey(referenceDate = new Date()): string {
  return getBerlinNowParts(referenceDate).dateKey;
}

export function getCurrentBerlinDateTimeKey(referenceDate = new Date()): string {
  const { dateKey, timeKey } = getBerlinNowParts(referenceDate);
  return `${dateKey}T${timeKey}`;
}

export function buildOccurrencePath(slug: string, dateKey: string): string {
  return `/veranstaltungen/${slug}/${dateKey}/`;
}

export function buildOccurrenceRouteParams(
  occurrence: Pick<EventOccurrence, "slug" | "occurrenceDate">,
): EventOccurrenceRouteParams {
  return {
    slug: occurrence.slug,
    date: occurrence.occurrenceDate,
  };
}

export function formatGermanDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const reference = new Date(Date.UTC(year, month - 1, day, 12));

  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(reference);
}

export function formatGermanMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const reference = new Date(Date.UTC(year, month - 1, 1, 12));

  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    month: "long",
    year: "numeric",
  }).format(reference);
}

export function formatGermanTimeRange(startTime: string, endTime: string): string {
  if (startTime === endTime) {
    return `${startTime} Uhr`;
  }

  return `${startTime} - ${endTime} Uhr`;
}

export function assertValidEventRecord(event: WebsiteEventRecord): void {
  if (!ISO_DATE_PATTERN.test(event.startDate)) {
    throw new Error(`Event "${event.slug}" has an invalid start date.`);
  }

  if (!ISO_DATE_PATTERN.test(event.endDate)) {
    throw new Error(`Event "${event.slug}" has an invalid end date.`);
  }

  if (!isValidTimeValue(event.startTime)) {
    throw new Error(`Event "${event.slug}" has an invalid start time.`);
  }

  if (!isValidTimeValue(event.endTime)) {
    throw new Error(`Event "${event.slug}" has an invalid end time.`);
  }

  parseDateKey(event.startDate);
  parseDateKey(event.endDate);

  if (event.recurrence.until) {
    parseDateKey(event.recurrence.until);
  }

  for (const dateKey of event.recurrence.exclusions) {
    parseDateKey(dateKey);
  }

  for (const dateKey of event.recurrence.inclusions) {
    parseDateKey(dateKey);
  }

  if (compareDateTimeKeys(event.endDate, event.endTime, event.startDate, event.startTime) < 0) {
    throw new Error(`Event "${event.slug}" ends before it starts.`);
  }

  if (event.timezone !== "Europe/Berlin") {
    throw new Error(`Event "${event.slug}" must use Europe/Berlin.`);
  }

  if (event.recurrence.type === "daily") {
    throw new Error(`Event "${event.slug}" uses daily recurrence, which is reserved at launch.`);
  }

  if (event.recurrence.type === "weekly" && event.recurrence.daysOfWeek.length === 0) {
    throw new Error(`Event "${event.slug}" needs at least one weekday for weekly recurrence.`);
  }

  if (event.recurrence.type !== "weekly" && event.recurrence.daysOfWeek.length > 0) {
    throw new Error(`Event "${event.slug}" defines weekdays without weekly recurrence.`);
  }

  if (event.recurrence.type !== "monthly" && event.recurrence.dayOfMonth !== undefined) {
    throw new Error(`Event "${event.slug}" defines a day of month without monthly recurrence.`);
  }

  if (event.recurrence.type === "monthly") {
    const dayOfMonth = event.recurrence.dayOfMonth ?? parseDateKey(event.startDate).getUTCDate();

    if (dayOfMonth < 1 || dayOfMonth > 31) {
      throw new Error(`Event "${event.slug}" has an invalid monthly day.`);
    }
  }
}

function getHorizonBounds(options: OccurrenceExpansionOptions): { start: string; end: string } {
  const referenceDateKey = options.referenceDateKey ?? getCurrentBerlinDateKey();
  const referenceDate = parseDateKey(referenceDateKey);
  const horizonStart = formatDateKey(
    addMonths(referenceDate, -(options.horizonPastMonths ?? DEFAULT_HORIZON_PAST_MONTHS)),
  );
  const horizonEnd = formatDateKey(
    addMonths(referenceDate, options.horizonFutureMonths ?? DEFAULT_HORIZON_FUTURE_MONTHS),
  );

  return { start: horizonStart, end: horizonEnd };
}

function isDateInsideRange(dateKey: string, rangeStart: string, rangeEnd: string): boolean {
  return compareDateKeys(dateKey, rangeStart) >= 0 && compareDateKeys(dateKey, rangeEnd) <= 0;
}

function matchesWeeklyPattern(event: WebsiteEventRecord, candidate: Date): boolean {
  const candidateWeekday = candidate.getUTCDay();
  const weekdayMatch = event.recurrence.daysOfWeek.some((weekday) => WEEKDAY_INDEX[weekday] === candidateWeekday);

  if (!weekdayMatch) {
    return false;
  }

  const startWeekAnchor = getWeekAnchor(parseDateKey(event.startDate));
  const candidateWeekAnchor = getWeekAnchor(candidate);
  const weeksBetween = Math.floor(differenceInCalendarDays(startWeekAnchor, candidateWeekAnchor) / 7);

  return weeksBetween >= 0 && weeksBetween % event.recurrence.interval === 0;
}

function matchesMonthlyPattern(event: WebsiteEventRecord, candidate: Date): boolean {
  const startDate = parseDateKey(event.startDate);
  const dayOfMonth = event.recurrence.dayOfMonth ?? startDate.getUTCDate();

  if (candidate.getUTCDate() !== dayOfMonth) {
    return false;
  }

  const monthsBetween = differenceInCalendarMonths(startDate, candidate);

  return monthsBetween >= 0 && monthsBetween % event.recurrence.interval === 0;
}

function generateOccurrenceDates(
  event: WebsiteEventRecord,
  rangeStart: string,
  rangeEnd: string,
): string[] {
  const latestAllowedDate = event.recurrence.until
    ? compareDateKeys(event.recurrence.until, rangeEnd) < 0
      ? event.recurrence.until
      : rangeEnd
    : rangeEnd;

  if (compareDateKeys(rangeStart, latestAllowedDate) > 0) {
    return [];
  }

  const dates = new Set<string>();

  if (event.recurrence.type === "none") {
    if (isDateInsideRange(event.startDate, rangeStart, latestAllowedDate)) {
      dates.add(event.startDate);
    }
  } else {
    let cursor = parseDateKey(rangeStart);
    const endDate = parseDateKey(latestAllowedDate);

    while (cursor.getTime() <= endDate.getTime()) {
      const candidateDateKey = formatDateKey(cursor);

      if (compareDateKeys(candidateDateKey, event.startDate) >= 0) {
        if (event.recurrence.type === "weekly" && matchesWeeklyPattern(event, cursor)) {
          dates.add(candidateDateKey);
        }

        if (event.recurrence.type === "monthly" && matchesMonthlyPattern(event, cursor)) {
          dates.add(candidateDateKey);
        }
      }

      cursor = addDays(cursor, 1);
    }
  }

  for (const inclusion of event.recurrence.inclusions) {
    if (
      compareDateKeys(inclusion, event.startDate) >= 0 &&
      isDateInsideRange(inclusion, rangeStart, latestAllowedDate)
    ) {
      dates.add(inclusion);
    }
  }

  for (const exclusion of event.recurrence.exclusions) {
    dates.delete(exclusion);
  }

  const sortedDates = Array.from(dates).sort(compareDateKeys);

  return event.recurrence.count ? sortedDates.slice(0, event.recurrence.count) : sortedDates;
}

function buildOccurrence(event: WebsiteEventRecord, occurrenceDate: string): EventOccurrence {
  const daySpan = differenceInCalendarDays(parseDateKey(event.startDate), parseDateKey(event.endDate));
  const shiftedEndDate = formatDateKey(addDays(parseDateKey(occurrenceDate), daySpan));

  return {
    ...event,
    occurrenceDate,
    endDate: shiftedEndDate,
    occurrencePath: buildOccurrencePath(event.slug, occurrenceDate),
    sortKey: `${occurrenceDate}T${event.startTime}`,
    isRecurring: event.recurrence.type !== "none",
  };
}

export function expandEventOccurrences(
  event: WebsiteEventRecord,
  options: OccurrenceExpansionOptions = {},
): EventOccurrence[] {
  assertValidEventRecord(event);

  if (event.visibility === "hidden" && !options.includeHidden) {
    return [];
  }

  const { start, end } = getHorizonBounds(options);
  const occurrenceDates = generateOccurrenceDates(event, start, end);

  return occurrenceDates.map((occurrenceDate) => buildOccurrence(event, occurrenceDate));
}

export function getAllOccurrences(
  events: WebsiteEventRecord[],
  options: OccurrenceExpansionOptions = {},
): EventOccurrence[] {
  return events
    .flatMap((event) => expandEventOccurrences(event, options))
    .sort((left, right) => left.sortKey.localeCompare(right.sortKey) || left.title.localeCompare(right.title));
}

export function getUpcomingOccurrences(
  events: WebsiteEventRecord[],
  limit?: number,
  options: OccurrenceExpansionOptions = {},
): EventOccurrence[] {
  const nowKey =
    options.referenceDateTimeKey ??
    (options.referenceDateKey ? `${options.referenceDateKey}T00:00` : getCurrentBerlinDateTimeKey());
  const upcoming = getAllOccurrences(events, options).filter((occurrence) => occurrence.sortKey >= nowKey);

  return typeof limit === "number" ? upcoming.slice(0, limit) : upcoming;
}

export function getOccurrenceRouteParams(
  events: WebsiteEventRecord[],
  options: OccurrenceExpansionOptions = {},
): EventOccurrenceRouteParams[] {
  return getAllOccurrences(events, options).map((occurrence) => buildOccurrenceRouteParams(occurrence));
}

export function getOccurrenceBySlugAndDate(
  events: WebsiteEventRecord[],
  slug: string,
  occurrenceDate: string,
  options: OccurrenceExpansionOptions = {},
): EventOccurrence | undefined {
  return getAllOccurrences(events, options).find(
    (occurrence) => occurrence.slug === slug && occurrence.occurrenceDate === occurrenceDate,
  );
}

export function getRelatedOccurrences(
  events: WebsiteEventRecord[],
  slug: string,
  fromDate?: string,
  limit?: number,
  options: OccurrenceExpansionOptions = {},
): EventOccurrence[] {
  const filtered = getAllOccurrences(events, options).filter((occurrence) => occurrence.slug === slug);
  const upcoming = fromDate
    ? filtered.filter((occurrence) => compareDateKeys(occurrence.occurrenceDate, fromDate) >= 0)
    : filtered;

  return typeof limit === "number" ? upcoming.slice(0, limit) : upcoming;
}

export function groupOccurrencesByMonth(
  occurrences: EventOccurrence[],
): Array<{ month: string; label: string; occurrences: EventOccurrence[] }> {
  const groups = new Map<string, EventOccurrence[]>();

  for (const occurrence of occurrences) {
    const monthKey = occurrence.occurrenceDate.slice(0, 7);
    const monthOccurrences = groups.get(monthKey) ?? [];
    monthOccurrences.push(occurrence);
    groups.set(monthKey, monthOccurrences);
  }

  return Array.from(groups.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([month, monthOccurrences]) => ({
      month,
      label: formatGermanMonthLabel(month),
      occurrences: monthOccurrences,
    }));
}

export function extractWixEventSlugDate(sourceUrl: string): string | undefined {
  const match = sourceUrl.match(WIX_EVENT_SLUG_DATE_PATTERN);

  if (!match?.[1]) {
    return undefined;
  }

  parseDateKey(match[1]);

  return match[1];
}

export function getWixSlugDateMismatchQaFinding(
  sourceUrl: string,
  canonicalDate: string,
  visibleDate = canonicalDate,
): WixEventMigrationQaFinding | undefined {
  parseDateKey(canonicalDate);
  parseDateKey(visibleDate);

  const sourceSlugDate = extractWixEventSlugDate(sourceUrl);

  if (!sourceSlugDate) {
    return undefined;
  }

  if (sourceSlugDate === canonicalDate && sourceSlugDate === visibleDate) {
    return undefined;
  }

  return {
    code: "wix-slug-date-mismatch",
    sourceUrl,
    sourceSlugDate,
    visibleDate,
    canonicalDate,
    message:
      "The Wix source URL date does not match the visible/canonical event date. Treat this as migration QA, not canonical truth.",
  };
}
