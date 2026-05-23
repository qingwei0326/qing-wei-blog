import { invoke } from '@tauri-apps/api/core';
import type {
  AppConfig,
  ArticleSummary,
  ArticleDetail,
  CreateArticlePayload,
  SaveArticlePayload,
  PublishPayload,
  RenameArticlePayload,
  PageSummary,
  PageDetail,
  SavePagePayload,
  PublishPagePayload,
} from '@/types';

export const api = {
  getConfig: () => invoke<AppConfig>('get_config'),
  listArticles: () => invoke<ArticleSummary[]>('list_articles'),
  readArticle: (relativePath: string) =>
    invoke<ArticleDetail>('read_article', { relativePath }),
  createArticle: (payload: CreateArticlePayload) =>
    invoke<ArticleDetail>('create_article', { payload }),
  saveArticle: (payload: SaveArticlePayload) =>
    invoke<{ relativePath: string; title: string }>('save_article', { payload }),
  savePastedImage: (bytes: Uint8Array, slug: string) =>
    invoke<string>('save_pasted_image', {
      bytes: Array.from(bytes),
      slug,
    }),
  saveClipboardImage: (slug: string) =>
    invoke<string>('save_clipboard_image', { slug }),
  publish: (payload: PublishPayload) =>
    invoke<void>('publish_article', { payload }),
  deleteArticle: (relativePath: string) =>
    invoke<void>('delete_article', { relativePath }),
  renameArticle: (payload: RenameArticlePayload) =>
    invoke<ArticleDetail>('rename_article', { payload }),
  listPages: () => invoke<PageSummary[]>('list_pages'),
  readPage: (relativePath: string) =>
    invoke<PageDetail>('read_page', { relativePath }),
  savePage: (payload: SavePagePayload) =>
    invoke<{ relativePath: string; title: string }>('save_page', { payload }),
  publishPage: (payload: PublishPagePayload) =>
    invoke<void>('publish_page', { payload }),
  readPublicAsset: (relativePath: string) =>
    invoke<number[]>('read_public_asset', { relativePath }),
};
