export const EVENT_STATUS_VALUES = ["scheduled", "cancelled", "postponed", "tentative"] as const;
export const EVENT_VISIBILITY_VALUES = ["public", "hidden"] as const;
export const EVENT_SOURCE_VALUES = ["website", "imported-dash", "migrated-wix"] as const;
export const RECURRENCE_TYPE_VALUES = ["none", "daily", "weekly", "monthly"] as const;
export const WEEKDAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type EventStatus = (typeof EVENT_STATUS_VALUES)[number];
export type EventVisibility = (typeof EVENT_VISIBILITY_VALUES)[number];
export type EventSource = (typeof EVENT_SOURCE_VALUES)[number];
export type RecurrenceType = (typeof RECURRENCE_TYPE_VALUES)[number];
export type WeekdayKey = (typeof WEEKDAY_KEYS)[number];

export interface EventRecurrence {
  type: RecurrenceType;
  interval: number;
  daysOfWeek: WeekdayKey[];
  dayOfMonth?: number;
  until?: string;
  count?: number;
  exclusions: string[];
  inclusions: string[];
}

export interface WebsiteEventRecord {
  id: string;
  title: string;
  slug: string;
  status: EventStatus;
  visibility: EventVisibility;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: "Europe/Berlin";
  locationName: string;
  summary: string;
  body?: string;
  address?: string;
  mapUrl?: string;
  heroImage?: unknown;
  gallery?: unknown[];
  ctaLabel?: string;
  ctaUrl?: string;
  registrationUrl?: string;
  costLabel?: string;
  audience?: string;
  equipmentInfo?: string;
  weatherNote?: string;
  instagramUrl?: string;
  source: EventSource;
  sourceId?: string;
  lastVerifiedAt?: string;
  recurrence: EventRecurrence;
}

export interface EventOccurrence extends WebsiteEventRecord {
  occurrenceDate: string;
  occurrencePath: string;
  sortKey: string;
  isRecurring: boolean;
}

export interface OccurrenceExpansionOptions {
  horizonPastMonths?: number;
  horizonFutureMonths?: number;
  referenceDateKey?: string;
  referenceDateTimeKey?: string;
  includeHidden?: boolean;
}
