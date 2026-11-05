import { describe, expect, it } from "bun:test";

import { resolveMediaPageContent, validateMediaEntries } from "./media";

const image = { image: "example.webp", alt: "A skater on a ramp" };

function gallery(id: string, data: Record<string, unknown> = {}) {
  return {
    id: `${id}.md`,
    data: {
      title: id,
      type: "photo-gallery" as const,
      gallery: [image],
      publishedAt: "2025-01-01T00:00:00Z",
      ...data,
    },
  };
}

function post(data: Record<string, unknown> = {}) {
  return {
    id: "post.md",
    data: {
      title: "Post gallery",
      slug: "post-gallery",
      publishedAt: "2026-01-01T00:00:00Z",
      gallery: [image],
      ...data,
    },
  };
}

describe("media page content", () => {
  it("combines opted-in post galleries with standalone galleries in descending date order", () => {
    const result = resolveMediaPageContent(
      [gallery("standalone")],
      [post({ showGalleryOnMediaPage: true })],
    );

    expect(result.galleries.map(({ key }) => key)).toEqual(["post-gallery", "standalone"]);
  });

  it("excludes opted-out and empty post galleries", () => {
    const result = resolveMediaPageContent(
      [gallery("standalone")],
      [post(), post({ slug: "empty", showGalleryOnMediaPage: true, gallery: undefined })],
    );

    expect(result.galleries.map(({ key }) => key)).toEqual(["standalone"]);
  });

  it("uses a deterministic key tie-breaker", () => {
    const result = resolveMediaPageContent(
      [gallery("z-gallery"), gallery("a-gallery")],
      [],
    );

    expect(result.galleries.map(({ key }) => key)).toEqual(["a-gallery", "z-gallery"]);
  });

  it("preserves the configured playlist URL", () => {
    const playlist = {
      id: "playlist.md",
      data: {
        title: "Playlist",
        type: "youtube" as const,
        youtubeUrl: "https://www.youtube.com/playlist?list=example",
      },
    };

    expect(resolveMediaPageContent([playlist], []).playlistUrl).toBe(playlist.data.youtubeUrl);
  });

  it("rejects a standalone gallery without images", () => {
    expect(() => validateMediaEntries([gallery("empty", { gallery: undefined })])).toThrow(
      "needs at least one image",
    );
  });

  it("rejects a YouTube entry without a URL", () => {
    const entry = { id: "videos.md", data: { title: "Videos", type: "youtube" as const } };
    expect(() => validateMediaEntries([entry])).toThrow("needs a YouTube URL");
  });

  it("rejects multiple playlist entries", () => {
    const playlist = (id: string) => ({
      id,
      data: {
        title: id,
        type: "youtube" as const,
        youtubeUrl: "https://www.youtube.com/playlist?list=example",
      },
    });

    expect(() => validateMediaEntries([playlist("one"), playlist("two")])).toThrow(
      "supports one YouTube playlist",
    );
  });
});
