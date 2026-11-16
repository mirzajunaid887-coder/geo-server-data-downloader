export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'code'; language?: string; code: string }
  | { type: 'callout'; variant: 'info' | 'warning' | 'tip'; title?: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'image'; src: string; alt: string; caption?: string; width?: number; height?: number }
  | { type: 'video'; src: string; label: string; poster?: string; caption?: string; width?: number; height?: number; autoplay?: boolean };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  author: string;
  datePublished: string; // ISO date
  dateModified: string;  // ISO date
  readingTimeMinutes: number;
  category: string;
  tags: string[];
  excerpt: string;
  content: ContentBlock[];
}