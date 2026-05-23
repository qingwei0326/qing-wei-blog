export interface AppConfig {
  blogPath: string;
}

export interface ArticleSummary {
  relativePath: string;
  filename: string;
  title: string;
  description: string;
  date: string;
  mtime: number;
}

export interface ArticleDetail {
  relativePath: string;
  filename: string;
  title: string;
  content: string;
}

export interface CreateArticlePayload {
  title: string;
  description?: string;
  tags?: string;
  category?: string;
}

export interface SaveArticlePayload {
  relativePath: string;
  content: string;
}

export interface PublishPayload {
  relativePath: string;
  content: string;
  title?: string;
}

export interface PublishLogEntry {
  stream: 'cmd' | 'stdout' | 'stderr';
  text: string;
}

export interface RenameArticlePayload {
  relativePath: string;
  newTitle: string;
}

export interface PageSummary {
  relativePath: string;
  label: string;
  title: string;
}

export interface PageDetail {
  relativePath: string;
  label: string;
  title: string;
  content: string;
}

export interface SavePagePayload {
  relativePath: string;
  content: string;
}

export interface PublishPagePayload {
  relativePath: string;
  content: string;
  title?: string;
}

export type DocumentKind = 'article' | 'page';

export type Tab = 'write' | 'preview';
