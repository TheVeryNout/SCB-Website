import { describe, expect, it } from "bun:test";

import { assertUniquePostSlugs, getPublicPosts, isPostPublic } from "./posts";

const NOW = new Date("2026-07-23T12:00:00Z");

describe("post publication policy", () => {
  it("keeps existing posts without a draft field public", () => {
    expect(isPostPublic({ publishedAt: "2026-07-22T12:00:00Z" }, NOW)).toBe(true);
  });

  it("hides explicit drafts", () => {
    expect(
      isPostPublic({ draft: true, publishedAt: "2026-07-22T12:00:00Z" }, NOW),
    ).toBe(false);
  });

  it("hides future-dated posts until their publication time", () => {
    expect(isPostPublic({ publishedAt: "2026-07-24T12:00:00Z" }, NOW)).toBe(false);
    expect(isPostPublic({ publishedAt: "2026-07-23T12:00:00Z" }, NOW)).toBe(true);
  });

  it("filters drafts and future posts without reordering eligible posts", () => {
    const entries = [
      { id: "published", data: { publishedAt: "2026-07-22T12:00:00Z" } },
      { id: "draft", data: { draft: true, publishedAt: "2026-07-21T12:00:00Z" } },
      { id: "future", data: { publishedAt: "2026-07-24T12:00:00Z" } },
    ];

    expect(getPublicPosts(entries, NOW).map((entry) => entry.id)).toEqual(["published"]);
  });

  it("rejects duplicate post slugs deterministically", () => {
    const entries = [
      { data: { slug: "duplicate" } },
      { data: { slug: "duplicate" } },
    ];

    expect(() => assertUniquePostSlugs(entries)).toThrow(
      'Collection "posts" contains the duplicate slug "duplicate".',
    );
  });
});
