import { getCollection, type CollectionEntry } from "astro:content";

import {
  assertValidEventRecord,
  getAllOccurrences as getAllOccurrencesFromEvents,
  getOccurrenceBySlugAndDate as getOccurrenceBySlugAndDateFromEvents,
  getOccurrenceRouteParams as getOccurrenceRouteParamsFromEvents,
  getRelatedOccurrences as getRelatedOccurrencesFromEvents,
  getUpcomingOccurrences as getUpcomingOccurrencesFromEvents,
  groupOccurrencesByMonth as groupOccurrencesByMonthFromEvents,
} from "../events/engine";
import type {
  EventOccurrence,
  EventOccurrenceRouteParams,
  OccurrenceExpansionOptions,
  WebsiteEventRecord,
} from "../events/model";

const REQUIRED_PAGE_SLUGS = ["about", "membership", "contact", "impressum", "datenschutz"] as const;

type RequiredPageSlug = (typeof REQUIRED_PAGE_SLUGS)[number];

interface SiteContentCache {
  homepage: CollectionEntry<"homepage">;
  settings: CollectionEntry<"settings">;
  pages: Map<RequiredPageSlug, CollectionEntry<"pages">>;
  posts: CollectionEntry<"posts">[];
  events: WebsiteEventRecord[];
  media: CollectionEntry<"media">[];
}

let siteContentPromise: Promise<SiteContentCache> | undefined;

function requireSingleEntry<TEntry>(collectionName: string, entries: TEntry[]): TEntry {
  if (entries.length !== 1) {
    throw new Error(`Collection "${collectionName}" must contain exactly one entry, found ${entries.length}.`);
  }

  return entries[0];
}

function hasBody(entry: { body?: string }): boolean {
  return typeof entry.body === "string" && entry.body.trim().length > 0;
}

function getEntryKey(entry: { id: string }): string {
  return entry.id.replace(/\.[^.]+$/, "");
}

function assertUniqueSlugs<TEntry extends { data: { slug: string } }>(collectionName: string, entries: TEntry[]) {
  const seen = new Set<string>();

  for (const entry of entries) {
    if (seen.has(entry.data.slug)) {
      throw new Error(`Collection "${collectionName}" contains the duplicate slug "${entry.data.slug}".`);
    }

    seen.add(entry.data.slug);
  }
}

function validatePageEntry(slug: RequiredPageSlug, entry: CollectionEntry<"pages">): void {
  switch (slug) {
    case "about":
      if (!entry.data.intro) {
        throw new Error('The "about" page needs an intro.');
      }

      if (!hasBody(entry)) {
        throw new Error('The "about" page needs body content.');
      }

      if (!entry.data.goals?.length) {
        throw new Error('The "about" page needs at least one goal.');
      }

      if (!entry.data.boardMembers?.length) {
        throw new Error('The "about" page needs at least one board member.');
      }

      if (!entry.data.statutesPdf) {
        throw new Error('The "about" page needs a statutes PDF path.');
      }

      break;
    case "membership":
      if (!entry.data.intro) {
        throw new Error('The "membership" page needs an intro.');
      }

      if (!entry.data.benefits?.length) {
        throw new Error('The "membership" page needs at least one benefit.');
      }

      if (!entry.data.applicationInstructions?.length) {
        throw new Error('The "membership" page needs application instructions.');
      }

      if (!entry.data.membershipFormPdf) {
        throw new Error('The "membership" page needs a membership form PDF path.');
      }

      break;
    case "contact":
      if (!entry.data.intro) {
        throw new Error('The "contact" page needs an intro.');
      }

      if (!entry.data.locationName) {
        throw new Error('The "contact" page needs a location name.');
      }

      if (!entry.data.mapUrl) {
        throw new Error('The "contact" page needs an external map link.');
      }

      break;
    case "impressum":
    case "datenschutz":
      if (!hasBody(entry)) {
        throw new Error(`The "${slug}" page needs body content.`);
      }

      break;
  }
}

function toEventRecord(entry: CollectionEntry<"events">): WebsiteEventRecord {
  return {
    id: entry.id,
    title: entry.data.title,
    slug: entry.data.slug,
    status: entry.data.status,
    visibility: entry.data.visibility,
    startDate: entry.data.startDate,
    startTime: entry.data.startTime,
    endDate: entry.data.endDate,
    endTime: entry.data.endTime,
    timezone: entry.data.timezone,
    locationName: entry.data.locationName,
    summary: entry.data.summary,
    body: entry.body?.trim() ? entry.body.trim() : undefined,
    address: entry.data.address,
    mapUrl: entry.data.mapUrl,
    heroImage: entry.data.heroImage,
    gallery: entry.data.gallery,
    ctaLabel: entry.data.ctaLabel,
    ctaUrl: entry.data.ctaUrl,
    registrationUrl: entry.data.registrationUrl,
    costLabel: entry.data.costLabel,
    audience: entry.data.audience,
    equipmentInfo: entry.data.equipmentInfo,
    weatherNote: entry.data.weatherNote,
    instagramUrl: entry.data.instagramUrl,
    source: entry.data.source,
    sourceId: entry.data.sourceId,
    lastVerifiedAt: entry.data.lastVerifiedAt,
    recurrence: {
      type: entry.data.recurrence.type,
      interval: entry.data.recurrence.interval,
      daysOfWeek: entry.data.recurrence.daysOfWeek,
      dayOfMonth: entry.data.recurrence.dayOfMonth,
      until: entry.data.recurrence.until,
      count: entry.data.recurrence.count,
      exclusions: entry.data.recurrence.exclusions,
      inclusions: entry.data.recurrence.inclusions,
    },
  };
}

async function loadValidatedSiteContent(): Promise<SiteContentCache> {
  if (!siteContentPromise) {
    siteContentPromise = (async () => {
      const [homepageEntries, settingsEntries, pageEntries, postEntries, eventEntries, mediaEntries] =
        await Promise.all([
          getCollection("homepage"),
          getCollection("settings"),
          getCollection("pages"),
          getCollection("posts"),
          getCollection("events"),
          getCollection("media"),
        ]);

      const homepage = requireSingleEntry("homepage", homepageEntries);
      const settings = requireSingleEntry("settings", settingsEntries);
      const pages = new Map<RequiredPageSlug, CollectionEntry<"pages">>();

      for (const entry of pageEntries) {
        const slug = getEntryKey(entry) as RequiredPageSlug;

        if (!REQUIRED_PAGE_SLUGS.includes(slug)) {
          throw new Error(`Unknown page singleton "${getEntryKey(entry)}" in the pages collection.`);
        }

        if (pages.has(slug)) {
          throw new Error(`Duplicate page singleton "${slug}" found in the pages collection.`);
        }

        validatePageEntry(slug, entry);
        pages.set(slug, entry);
      }

      for (const requiredSlug of REQUIRED_PAGE_SLUGS) {
        if (!pages.has(requiredSlug)) {
          throw new Error(`Missing required page singleton "${requiredSlug}".`);
        }
      }

      assertUniqueSlugs("posts", postEntries);

      for (const entry of postEntries) {
        if (!hasBody(entry)) {
          throw new Error(`Post "${entry.data.slug}" needs body content.`);
        }
      }

      assertUniqueSlugs("events", eventEntries);

      const events = eventEntries.map(toEventRecord);

      for (const event of events) {
        assertValidEventRecord(event);
      }

      assertUniqueSlugs("media", mediaEntries);

      for (const entry of mediaEntries) {
        if (entry.data.type === "youtube" && !entry.data.youtubeUrl) {
          throw new Error(`Media entry "${entry.data.slug}" needs a YouTube URL.`);
        }

        if (entry.data.type === "photo-gallery" && !entry.data.gallery?.length) {
          throw new Error(`Media entry "${entry.data.slug}" needs at least one gallery image.`);
        }
      }

      return {
        homepage,
        settings,
        pages,
        posts: postEntries.sort(
          (left, right) =>
            new Date(right.data.publishedAt).getTime() - new Date(left.data.publishedAt).getTime(),
        ),
        events,
        media: mediaEntries.sort((left, right) => left.data.title.localeCompare(right.data.title)),
      };
    })();
  }

  return siteContentPromise;
}

export async function validateSiteContent(): Promise<void> {
  await loadValidatedSiteContent();
}

export async function getHomepageEntry(): Promise<CollectionEntry<"homepage">> {
  return (await loadValidatedSiteContent()).homepage;
}

export async function getSiteSettingsEntry(): Promise<CollectionEntry<"settings">> {
  return (await loadValidatedSiteContent()).settings;
}

export async function getRequiredPageEntry(slug: RequiredPageSlug): Promise<CollectionEntry<"pages">> {
  return (await loadValidatedSiteContent()).pages.get(slug)!;
}

export async function getLatestPosts(limit = 3): Promise<CollectionEntry<"posts">[]> {
  return (await loadValidatedSiteContent()).posts.slice(0, limit);
}

export async function getAllPosts(): Promise<CollectionEntry<"posts">[]> {
  return (await loadValidatedSiteContent()).posts;
}

export async function getAllEvents(): Promise<WebsiteEventRecord[]> {
  return (await loadValidatedSiteContent()).events;
}

export async function getAllEventOccurrences(
  options: OccurrenceExpansionOptions = {},
): Promise<EventOccurrence[]> {
  return getAllOccurrencesFromEvents((await loadValidatedSiteContent()).events, options);
}

export async function getUpcomingOccurrences(
  limit = 5,
  options: OccurrenceExpansionOptions = {},
): Promise<EventOccurrence[]> {
  return getUpcomingOccurrencesFromEvents((await loadValidatedSiteContent()).events, limit, options);
}

export async function getEventOccurrenceRouteParams(
  options: OccurrenceExpansionOptions = {},
): Promise<EventOccurrenceRouteParams[]> {
  return getOccurrenceRouteParamsFromEvents((await loadValidatedSiteContent()).events, options);
}

export async function getEventOccurrenceBySlugAndDate(
  slug: string,
  date: string,
  options: OccurrenceExpansionOptions = {},
): Promise<EventOccurrence | undefined> {
  return getOccurrenceBySlugAndDateFromEvents((await loadValidatedSiteContent()).events, slug, date, options);
}

export async function getRelatedEventOccurrences(
  slug: string,
  fromDate?: string,
  limit?: number,
  options: OccurrenceExpansionOptions = {},
): Promise<EventOccurrence[]> {
  return getRelatedOccurrencesFromEvents((await loadValidatedSiteContent()).events, slug, fromDate, limit, options);
}

export async function getEventOccurrencesGroupedByMonth(
  options: OccurrenceExpansionOptions = {},
): Promise<Array<{ month: string; label: string; occurrences: EventOccurrence[] }>> {
  return groupOccurrencesByMonthFromEvents(await getAllEventOccurrences(options));
}

export async function getAllMedia(): Promise<CollectionEntry<"media">[]> {
  return (await loadValidatedSiteContent()).media;
}
