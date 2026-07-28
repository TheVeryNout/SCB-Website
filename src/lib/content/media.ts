interface GalleryItem<TImage = unknown> {
  image: TImage;
  alt: string;
  caption?: string;
}

interface MediaData<TImage = unknown> {
  slug: string;
  type: "youtube" | "photo-gallery" | "featured-media";
  youtubeUrl?: string;
  postSlug?: string;
  gallery?: GalleryItem<TImage>[];
}

interface PostData<TImage = unknown> {
  slug: string;
  gallery?: GalleryItem<TImage>[];
}

interface ContentEntry<TData> {
  data: TData;
}

export interface ResolvedMediaEntry<TMediaEntry, TImage = unknown> {
  entry: TMediaEntry;
  gallery?: GalleryItem<TImage>[];
}

export function validateMediaEntries<
  TImage,
  TMediaEntry extends ContentEntry<MediaData<TImage>>,
  TPostEntry extends ContentEntry<PostData<TImage>>,
>(mediaEntries: TMediaEntry[], publicPosts: TPostEntry[]): void {
  const postsBySlug = new Map(publicPosts.map((entry) => [entry.data.slug, entry]));

  for (const entry of mediaEntries) {
    const { gallery, postSlug, slug, type, youtubeUrl } = entry.data;

    if (type === "youtube" && !youtubeUrl) {
      throw new Error(`Media entry "${slug}" needs a YouTube URL.`);
    }

    if (type !== "photo-gallery") {
      continue;
    }

    const hasLocalGallery = Boolean(gallery?.length);
    const hasPostReference = Boolean(postSlug);

    if (hasLocalGallery === hasPostReference) {
      throw new Error(
        `Photo gallery "${slug}" needs exactly one source: either postSlug or a local gallery.`,
      );
    }

    if (postSlug) {
      const post = postsBySlug.get(postSlug);

      if (!post) {
        throw new Error(`Photo gallery "${slug}" references missing or non-public post "${postSlug}".`);
      }

      if (!post.data.gallery?.length) {
        throw new Error(`Photo gallery "${slug}" references post "${postSlug}" without a gallery.`);
      }
    }
  }
}

export function resolveMediaEntries<
  TImage,
  TMediaEntry extends ContentEntry<MediaData<TImage>>,
  TPostEntry extends ContentEntry<PostData<TImage>>,
>(mediaEntries: TMediaEntry[], publicPosts: TPostEntry[]): Array<ResolvedMediaEntry<TMediaEntry, TImage>> {
  validateMediaEntries(mediaEntries, publicPosts);
  const postsBySlug = new Map(publicPosts.map((entry) => [entry.data.slug, entry]));

  return mediaEntries.map((entry) => ({
    entry,
    gallery:
      entry.data.type === "photo-gallery"
        ? entry.data.postSlug
          ? postsBySlug.get(entry.data.postSlug)!.data.gallery
          : entry.data.gallery
        : undefined,
  }));
}
