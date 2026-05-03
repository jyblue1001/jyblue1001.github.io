import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => data.hidden !== true);

  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function getPostExcerpt(body: string, maxLength = 190) {
  const cleaned = body
    .replace(/^# Table of Contents[\s\S]*?(?=^##\s|\n[A-Z][^\n]+\n)/m, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`$]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

export function getPostImage(body: string) {
  const htmlImage = body.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (htmlImage?.[1]) {
    return htmlImage[1];
  }

  const markdownImage = body.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/);
  return markdownImage?.[1];
}

export function getPostThumbnail(post: CollectionEntry<'posts'>) {
  return post.data.thumbnail ?? getPostImage(post.body);
}

export function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function slugifyTaxonomy(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
