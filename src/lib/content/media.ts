interface GalleryItem<TImage = unknown> {
  image: TImage;
  alt: string;
  caption?: string;
}

interface MediaData<TImage = unknown> {
  title: string;
  type: "youtube" | "photo-gallery";
  youtubeUrl?: string;
  gallery?: GalleryItem<TImage>[];
  summary?: string;
  publishedAt?: string | Date;
}

interface PostData<TImage = unknown> {
  title: string;
  slug?: string;
  publishedAt: string | Date;
  excerpt?: string;
  showGalleryOnMediaPage?: boolean;
  gallery?: GalleryItem<TImage>[];
}

interface ContentEntry<TData> {
  id: string;
  data: TData;
}

export interface MediaGallery<TImage = unknown> {
  key: string;
  title: string;
  summary?: string;
  publishedAt?: string | Date;
  gallery: GalleryItem<TImage>[];
}

export interface MediaPageContent<TImage = unknown> {
  playlistUrl?: string;
  galleries: MediaGallery<TImage>[];
}

function mediaKey(entry: { id: string }): string {
  return entry.id.replace(/\.[^.]+$/, "").split("/").at(-1)!;
}

function publishedTime(value?: string | Date): number {
  return value ? new Date(value).getTime() : 0;
}

export function validateMediaEntries<TImage, TEntry extends ContentEntry<MediaData<TImage>>>(
  mediaEntries: TEntry[],
): void {
  const playlistEntries = mediaEntries.filter(({ data }) => data.type === "youtube");

  if (playlistEntries.length > 1) {
    throw new Error(`The media collection supports one YouTube playlist, found ${playlistEntries.length}.`);
  }

  for (const entry of mediaEntries) {
    if (entry.data.type === "youtube" && !entry.data.youtubeUrl) {
      throw new Error(`Media entry "${mediaKey(entry)}" needs a YouTube URL.`);
    }

    if (entry.data.type === "photo-gallery" && !entry.data.gallery?.length) {
      throw new Error(`Standalone gallery "${mediaKey(entry)}" needs at least one image.`);
    }
  }
}

export function resolveMediaPageContent<
  TImage,
  TMediaEntry extends ContentEntry<MediaData<TImage>>,
  TPostEntry extends ContentEntry<PostData<TImage>>,
>(mediaEntries: TMediaEntry[], publicPosts: TPostEntry[]): MediaPageContent<TImage> {
  validateMediaEntries(mediaEntries);

  const standaloneGalleries = mediaEntries
    .filter((entry) => entry.data.type === "photo-gallery" && entry.data.gallery?.length)
    .map((entry) => ({
      key: mediaKey(entry),
      title: entry.data.title,
      summary: entry.data.summary,
      publishedAt: entry.data.publishedAt,
      gallery: entry.data.gallery!,
    }));

  const postGalleries = publicPosts
    .filter((entry) => entry.data.showGalleryOnMediaPage && entry.data.gallery?.length)
    .map((entry) => ({
      key: entry.data.slug ?? mediaKey(entry),
      title: entry.data.title,
      summary: entry.data.excerpt,
      publishedAt: entry.data.publishedAt,
      gallery: entry.data.gallery!,
    }));

  return {
    playlistUrl: mediaEntries.find(({ data }) => data.type === "youtube")?.data.youtubeUrl,
    galleries: [...standaloneGalleries, ...postGalleries].sort(
      (left, right) =>
        publishedTime(right.publishedAt) - publishedTime(left.publishedAt) ||
        left.key.localeCompare(right.key),
    ),
  };
}
