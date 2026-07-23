import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const slugField = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

const nonEmptyString = z.string().trim().min(1);
const optionalNonEmptyString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  nonEmptyString.optional(),
);
const publicPathField = z
  .string()
  .trim()
  .min(1)
  .regex(/^\/(?!\/)/, "Use a site-relative path that starts with /.");
const externalUrlField = z.string().trim().url();
const linkField = z
  .string()
  .trim()
  .min(1)
  .refine((value) => /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value), {
    message: "Use either a site-relative path or an absolute http(s) URL.",
  });
const optionalLinkField = z.preprocess(
  (value) => (value === "" ? undefined : value),
  linkField.optional(),
);
const optionalExternalUrlField = z.preprocess(
  (value) => (value === "" ? undefined : value),
  externalUrlField.optional(),
);
const optionalBooleanField = (defaultValue: boolean) =>
  z.preprocess(
    (value) => (value === "" || value === undefined || value === null ? undefined : value),
    z.boolean().default(defaultValue),
  );
const positiveIntegerWithDefault = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.number().int().min(1).default(1),
);
const optionalPositiveIntegerField = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.number().int().min(1).optional(),
);
const optionalDayOfMonthField = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.number().int().min(1).max(31).optional(),
);
const isoDateField = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD."),
);
const optionalIsoDateField = z.preprocess(
  (value) => (value === "" ? undefined : value),
  isoDateField.optional(),
);
const additionalInfoField = z
  .object({
    enabled: z.boolean().default(false),
    label: optionalNonEmptyString,
    title: optionalNonEmptyString,
    text: optionalNonEmptyString,
  })
  .optional();
const isoTimeField = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM in 24-hour time.");
const isoDateTimeField = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.string().trim().datetime({ offset: true, message: "Use an ISO datetime with timezone offset." }),
);
const weekdayField = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

const homepage = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/homepage" }),
  schema: ({ image }) =>
    z.object({
      title: nonEmptyString,
      heroTitle: nonEmptyString,
      heroIntro: nonEmptyString,
      heroImage: image().optional(),
      featuredAnnouncement: z
        .object({
          enabled: z.boolean().default(true),
          title: nonEmptyString,
          body: nonEmptyString,
          linkLabel: optionalNonEmptyString,
          linkUrl: optionalLinkField,
        })
        .refine(
          (value) =>
            (value.linkLabel === undefined && value.linkUrl === undefined) ||
            (value.linkLabel !== undefined && value.linkUrl !== undefined),
          {
            message: "Provide both a link label and link URL, or leave both empty.",
            path: ["linkLabel"],
          },
        )
        .optional(),
      membershipCtaTitle: nonEmptyString.optional(),
      membershipCtaText: nonEmptyString.optional(),
      membershipCtaLabel: nonEmptyString.optional(),
      mediaTeaserTitle: nonEmptyString.optional(),
      mediaTeaserText: nonEmptyString.optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: ({ image }) =>
    z.object({
      title: nonEmptyString,
      intro: nonEmptyString.optional(),
      heroImage: image().optional(),
      goals: z.array(nonEmptyString).optional(),
      boardMembers: z
        .array(
          z.object({
            name: nonEmptyString,
            role: nonEmptyString,
            image: image().optional(),
          }),
        )
        .optional(),
      statutesPdf: publicPathField.optional(),
      benefits: z.array(nonEmptyString).optional(),
      applicationInstructions: z.array(nonEmptyString).optional(),
      membershipFormPdf: publicPathField.optional(),
      notes: z.array(nonEmptyString).optional(),
      locationName: nonEmptyString.optional(),
      mapUrl: optionalExternalUrlField,
      addressOverride: optionalNonEmptyString,
      mapImage: image().optional(),
      locationNotes: optionalNonEmptyString,
      eyebrow: optionalNonEmptyString,
      listTitle: optionalNonEmptyString,
      listIntro: optionalNonEmptyString,
      additionalInfo: additionalInfoField,
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: nonEmptyString,
      slug: slugField,
      publishedAt: isoDateTimeField,
      excerpt: nonEmptyString,
      draft: optionalBooleanField(false),
      coverImage: z.preprocess(
        (value) => (value === "" || value === null ? undefined : value),
        image().optional(),
      ),
      coverAlt: optionalNonEmptyString,
      coverCaption: optionalNonEmptyString,
      coverMode: z.enum(["wide", "portrait", "contained"]).default("wide"),
      gallery: z.preprocess(
        (value) => (value === "" || value === null || (Array.isArray(value) && value.length === 0) ? undefined : value),
        z
          .array(
            z.object({
              image: image(),
              alt: nonEmptyString,
              caption: optionalNonEmptyString,
            }),
          )
          .optional(),
      ),
      category: optionalNonEmptyString,
      updatedAt: z.preprocess(
        (value) => (value === "" || value === null ? undefined : value),
        isoDateTimeField.optional(),
      ),
      sourceUrl: optionalExternalUrlField,
    }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z
      .object({
        title: nonEmptyString,
        slug: slugField,
        status: z.enum(["scheduled", "cancelled", "postponed", "tentative"]),
        visibility: z.enum(["public", "hidden"]).default("public"),
        startDate: isoDateField,
        startTime: isoTimeField,
        endDate: isoDateField,
        endTime: isoTimeField,
        timezone: z.enum(["Europe/Berlin"]).default("Europe/Berlin"),
        locationName: nonEmptyString,
        summary: nonEmptyString,
        address: optionalNonEmptyString,
        mapUrl: optionalExternalUrlField,
        heroImage: image().optional(),
        gallery: z.array(image()).optional(),
        ctaLabel: optionalNonEmptyString,
        ctaUrl: optionalLinkField,
        registrationUrl: optionalExternalUrlField,
        costLabel: optionalNonEmptyString,
        audience: optionalNonEmptyString,
        equipmentInfo: optionalNonEmptyString,
        additionalInfo: additionalInfoField,
        instagramUrl: optionalExternalUrlField,
        source: z.enum(["website", "imported-dash", "migrated-wix"]).default("website"),
        sourceId: optionalNonEmptyString,
        lastVerifiedAt: optionalIsoDateField,
        recurrence: z
          .object({
            type: z.enum(["none", "daily", "weekly", "monthly"]).default("none"),
            interval: positiveIntegerWithDefault,
            daysOfWeek: z.array(weekdayField).default([]),
            dayOfMonth: optionalDayOfMonthField,
            until: optionalIsoDateField,
            count: optionalPositiveIntegerField,
            exclusions: z.array(isoDateField).default([]),
            inclusions: z.array(isoDateField).default([]),
          })
          .default({
            type: "none",
            interval: 1,
            daysOfWeek: [],
            exclusions: [],
            inclusions: [],
          }),
      })
      .superRefine((value, context) => {
        const { recurrence } = value;

        if (recurrence.type === "daily") {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["recurrence", "type"],
            message: "Daily recurrence stays reserved and is not supported at launch.",
          });
        }

        if (recurrence.type !== "weekly" && recurrence.daysOfWeek.length > 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["recurrence", "daysOfWeek"],
            message: "Weekdays are only used for weekly recurrence.",
          });
        }

        if (recurrence.type !== "monthly" && recurrence.dayOfMonth !== undefined) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["recurrence", "dayOfMonth"],
            message: "A day of month is only used for monthly recurrence.",
          });
        }
      }),
});

const media = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/media" }),
  schema: ({ image }) =>
    z.object({
      title: nonEmptyString,
      slug: slugField,
      type: z.enum(["youtube", "photo-gallery", "featured-media"]),
      youtubeUrl: externalUrlField.optional(),
      thumbnailImage: image().optional(),
      gallery: z.array(image()).optional(),
      summary: nonEmptyString.optional(),
      publishedAt: isoDateTimeField.optional(),
    }),
});

const settings = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/settings" }),
  schema: () =>
    z.object({
      organizationName: nonEmptyString,
      siteDescription: nonEmptyString,
      contactEmail: z.string().trim().email(),
      contactPhone: optionalNonEmptyString,
      whatsApp: optionalNonEmptyString,
      postalAddress: nonEmptyString,
      socialLinks: z
        .array(
          z.object({
            label: nonEmptyString,
            url: externalUrlField,
          }),
        )
        .min(1),
      donationDetails: nonEmptyString.optional(),
      footerNote: nonEmptyString.optional(),
    }),
});

export const collections = {
  homepage,
  pages,
  posts,
  events,
  media,
  settings,
};
