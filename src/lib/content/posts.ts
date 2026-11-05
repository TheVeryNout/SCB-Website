export interface PostPublicationData {
  draft?: boolean;
  publishedAt: string | Date;
}

function slugFromId(id: string): string {
  return id.replace(/\.[^.]+$/, "").split("/").at(-1)!;
}

export function normalizePostSlugs<
  TEntry extends { id: string; data: { slug?: string; [key: string]: unknown } },
>(entries: TEntry[]): Array<Omit<TEntry, "data"> & { data: TEntry["data"] & { slug: string } }> {
  return entries.map((entry) => ({
    ...entry,
    data: {
      ...entry.data,
      slug: entry.data.slug ?? slugFromId(entry.id),
    },
  }));
}

export function assertUniquePostSlugs<TEntry extends { id: string; data: { slug?: string } }>(entries: TEntry[]): void {
  const seen = new Set<string>();

  for (const entry of entries) {
    const slug = entry.data.slug ?? slugFromId(entry.id);

    if (seen.has(slug)) {
      throw new Error(`Collection "posts" contains the duplicate slug "${slug}".`);
    }

    seen.add(slug);
  }
}

export function isPostPublic(data: PostPublicationData, now = new Date()): boolean {
  if (data.draft) {
    return false;
  }

  return new Date(data.publishedAt).getTime() <= now.getTime();
}

export function getPublicPosts<TEntry extends { data: PostPublicationData }>(
  entries: TEntry[],
  now = new Date(),
): TEntry[] {
  return entries.filter((entry) => isPostPublic(entry.data, now));
}
