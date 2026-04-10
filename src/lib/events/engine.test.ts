import { describe, expect, it } from "bun:test";

import {
  buildOccurrencePath,
  expandEventOccurrences,
  getAllOccurrences,
  getRelatedOccurrences,
  getUpcomingOccurrences,
  groupOccurrencesByMonth,
} from "./engine";
import type { WebsiteEventRecord } from "./model";

function createEvent(overrides: Partial<WebsiteEventRecord> = {}): WebsiteEventRecord {
  return {
    id: "seed-event",
    title: "Sunday Funday!",
    slug: "sunday-funday",
    status: "scheduled",
    visibility: "public",
    startDate: "2025-11-30",
    startTime: "10:00",
    endDate: "2025-11-30",
    endTime: "12:00",
    timezone: "Europe/Berlin",
    locationName: "Skatepark Weißenburg",
    summary: "Offen für alle Einsteiger - und kostet nix!",
    body: "Seed event body.",
    source: "website",
    recurrence: {
      type: "none",
      interval: 1,
      daysOfWeek: [],
      exclusions: [],
      inclusions: [],
      ...overrides.recurrence,
    },
    ...overrides,
  };
}

describe("event engine", () => {
  it("normalizes a one-off event into one occurrence", () => {
    const event = createEvent();
    const occurrences = expandEventOccurrences(event, {
      referenceDateKey: "2025-11-30",
      horizonPastMonths: 0,
      horizonFutureMonths: 1,
    });

    expect(occurrences).toHaveLength(1);
    expect(occurrences[0]?.occurrencePath).toBe("/veranstaltungen/sunday-funday/2025-11-30/");
  });

  it("expands a weekly recurrence across the horizon", () => {
    const event = createEvent({
      recurrence: {
        type: "weekly",
        interval: 1,
        daysOfWeek: ["sunday"],
        exclusions: [],
        inclusions: [],
      },
    });

    const occurrences = expandEventOccurrences(event, {
      referenceDateKey: "2025-12-01",
      horizonPastMonths: 0,
      horizonFutureMonths: 1,
    });

    expect(occurrences.map((occurrence) => occurrence.occurrenceDate)).toEqual([
      "2025-12-07",
      "2025-12-14",
      "2025-12-21",
      "2025-12-28",
    ]);
  });

  it("expands monthly same-date recurrence", () => {
    const event = createEvent({
      slug: "mitgliedertreffen",
      startDate: "2025-01-15",
      endDate: "2025-01-15",
      recurrence: {
        type: "monthly",
        interval: 1,
        dayOfMonth: 15,
        daysOfWeek: [],
        exclusions: [],
        inclusions: [],
      },
    });

    const occurrences = expandEventOccurrences(event, {
      referenceDateKey: "2025-01-15",
      horizonPastMonths: 0,
      horizonFutureMonths: 3,
    });

    expect(occurrences.map((occurrence) => occurrence.occurrenceDate)).toEqual([
      "2025-01-15",
      "2025-02-15",
      "2025-03-15",
      "2025-04-15",
    ]);
  });

  it("stops weekly recurrence at until", () => {
    const event = createEvent({
      recurrence: {
        type: "weekly",
        interval: 1,
        daysOfWeek: ["sunday"],
        until: "2025-12-14",
        exclusions: [],
        inclusions: [],
      },
    });

    const occurrences = expandEventOccurrences(event, {
      referenceDateKey: "2025-11-30",
      horizonPastMonths: 0,
      horizonFutureMonths: 2,
    });

    expect(occurrences.map((occurrence) => occurrence.occurrenceDate)).toEqual([
      "2025-11-30",
      "2025-12-07",
      "2025-12-14",
    ]);
  });

  it("applies the count boundary after inclusions and exclusions", () => {
    const event = createEvent({
      recurrence: {
        type: "weekly",
        interval: 1,
        daysOfWeek: ["sunday"],
        count: 2,
        exclusions: ["2025-12-07"],
        inclusions: ["2025-12-10"],
      },
    });

    const occurrences = expandEventOccurrences(event, {
      referenceDateKey: "2025-11-30",
      horizonPastMonths: 0,
      horizonFutureMonths: 2,
    });

    expect(occurrences.map((occurrence) => occurrence.occurrenceDate)).toEqual([
      "2025-11-30",
      "2025-12-10",
    ]);
  });

  it("sorts upcoming occurrences across different logical events", () => {
    const later = createEvent({
      id: "later",
      slug: "later-session",
      title: "Later Session",
      startDate: "2026-04-15",
      endDate: "2026-04-15",
      startTime: "16:00",
      endTime: "18:00",
    });
    const sooner = createEvent({
      id: "sooner",
      slug: "sooner-session",
      title: "Sooner Session",
      startDate: "2026-04-12",
      endDate: "2026-04-12",
      startTime: "09:00",
      endTime: "11:00",
    });

    const occurrences = getUpcomingOccurrences([later, sooner], undefined, {
      referenceDateKey: "2026-04-10",
      referenceDateTimeKey: "2026-04-10T00:00",
      horizonPastMonths: 0,
      horizonFutureMonths: 1,
    });

    expect(occurrences.map((occurrence) => occurrence.slug)).toEqual(["sooner-session", "later-session"]);
  });

  it("groups occurrences by month", () => {
    const weekly = createEvent({
      recurrence: {
        type: "weekly",
        interval: 1,
        daysOfWeek: ["sunday"],
        exclusions: [],
        inclusions: [],
      },
    });

    const grouped = groupOccurrencesByMonth(
      getAllOccurrences([weekly], {
        referenceDateKey: "2025-11-30",
        horizonPastMonths: 0,
        horizonFutureMonths: 2,
      }),
    );

    expect(grouped.map((group) => group.month)).toEqual(["2025-11", "2025-12", "2026-01"]);
  });

  it("returns related occurrences for one slug", () => {
    const weekly = createEvent({
      recurrence: {
        type: "weekly",
        interval: 1,
        daysOfWeek: ["sunday"],
        exclusions: [],
        inclusions: [],
      },
    });

    const related = getRelatedOccurrences([weekly], "sunday-funday", "2025-12-07", 2, {
      referenceDateKey: "2025-11-30",
      horizonPastMonths: 0,
      horizonFutureMonths: 2,
    });

    expect(related.map((occurrence) => occurrence.occurrenceDate)).toEqual([
      "2025-12-07",
      "2025-12-14",
    ]);
  });

  it("rejects unsupported launch recurrence", () => {
    const event = createEvent({
      recurrence: {
        type: "daily",
        interval: 1,
        daysOfWeek: [],
        exclusions: [],
        inclusions: [],
      },
    });

    expect(() =>
      expandEventOccurrences(event, {
        referenceDateKey: "2025-11-30",
        horizonPastMonths: 0,
        horizonFutureMonths: 1,
      }),
    ).toThrow("daily recurrence");
  });

  it("rejects an event whose end is before its start", () => {
    const event = createEvent({
      endTime: "08:00",
    });

    expect(() =>
      expandEventOccurrences(event, {
        referenceDateKey: "2025-11-30",
        horizonPastMonths: 0,
        horizonFutureMonths: 1,
      }),
    ).toThrow("ends before it starts");
  });

  it("builds occurrence paths with the locked route pattern", () => {
    expect(buildOccurrencePath("sunday-funday", "2025-11-30")).toBe(
      "/veranstaltungen/sunday-funday/2025-11-30/",
    );
  });
});
