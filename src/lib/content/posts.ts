export interface PostPublicationData {
  draft?: boolean;
  publishedAt: string | Date;
}

export function assertUniquePostSlugs<TEntry extends { data: { slug: string } }>(entries: TEntry[]): void {
  const seen = new Set<string>();

  for (const entry of entries) {
    if (seen.has(entry.data.slug)) {
      throw new Error(`Collection "posts" contains the duplicate slug "${entry.data.slug}".`);
    }

    seen.add(entry.data.slug);
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
