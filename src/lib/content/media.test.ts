import { describe, expect, it } from "bun:test";

import { resolveMediaEntries, validateMediaEntries } from "./media";

const image = { image: "example.webp", alt: "A skater on a ramp" };
const publicPost = { data: { slug: "post-with-gallery", gallery: [image] } };

function media(data: Record<string, unknown>) {
  return { data: { slug: "media-entry", type: "photo-gallery" as const, ...data } };
}

describe("media gallery ownership", () => {
  it("accepts and resolves a standalone structured gallery", () => {
    const entry = media({ gallery: [image] });
    validateMediaEntries([entry], [publicPost]);
    expect(resolveMediaEntries([entry], [publicPost])[0].gallery).toEqual([image]);
  });

  it("accepts and resolves a referenced public post gallery", () => {
    const entry = media({ postSlug: "post-with-gallery" });
    validateMediaEntries([entry], [publicPost]);
    expect(resolveMediaEntries([entry], [publicPost])[0].gallery).toEqual([image]);
  });

  it("rejects a missing referenced post", () => {
    expect(() => validateMediaEntries([media({ postSlug: "missing" })], [publicPost])).toThrow(
      'references missing or non-public post "missing"',
    );
  });

  it("rejects a referenced post without a gallery", () => {
    const post = { data: { slug: "empty-post", gallery: undefined } };
    expect(() => validateMediaEntries([media({ postSlug: "empty-post" })], [post])).toThrow(
      'references post "empty-post" without a gallery',
    );
  });

  it("rejects simultaneous post and local gallery ownership", () => {
    expect(() =>
      validateMediaEntries([media({ postSlug: "post-with-gallery", gallery: [image] })], [publicPost]),
    ).toThrow("needs exactly one source");
  });

  it("rejects a photo gallery without either source", () => {
    expect(() => validateMediaEntries([media({})], [publicPost])).toThrow("needs exactly one source");
  });

  it("keeps YouTube entries valid when they have a URL", () => {
    const entry = {
      data: {
        slug: "videos",
        type: "youtube" as const,
        youtubeUrl: "https://www.youtube.com/playlist?list=example",
      },
    };
    validateMediaEntries([entry], [publicPost]);
  });

  it("rejects a YouTube entry without a URL", () => {
    const entry = { data: { slug: "videos", type: "youtube" as const } };
    expect(() => validateMediaEntries([entry], [publicPost])).toThrow("needs a YouTube URL");
  });
});
