import { useEffect, useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { api } from '@/lib/tauri';

interface PreviewProps {
  content: string;
  blogPath: string;
}

function extractLocalSrcs(html: string): string[] {
  const container = document.createElement('div');
  container.innerHTML = html;
  const srcs: string[] = [];
  container.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (!src) return;
    if (
      /^([a-z]+:)?\/\//i.test(src) ||
      src.startsWith('data:') ||
      src.startsWith('blob:') ||
      src.startsWith('asset:')
    ) {
      return;
    }
    srcs.push(src);
  });
  return Array.from(new Set(srcs));
}

function applySrcMap(html: string, map: Map<string, string>): string {
  const container = document.createElement('div');
  container.innerHTML = html;
  container.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && map.has(src)) {
      img.setAttribute('src', map.get(src)!);
    }
  });
  return container.innerHTML;
}

function sanitizeMarkdownHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}

function guessMime(path: string): string {
  const ext = path.toLowerCase().split('.').pop() || '';
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    case 'avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
}

export function Preview({ content, blogPath }: PreviewProps) {
  const [html, setHtml] = useState('');
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const newBlobUrls: string[] = [];

    (async () => {
      const rendered = await Promise.resolve(
        marked.parse(content, { gfm: true, breaks: false }),
      );
      if (cancelled) return;

      const sanitized = sanitizeMarkdownHtml(rendered);
      const srcs = extractLocalSrcs(sanitized);
      const map = new Map<string, string>();

      await Promise.all(
        srcs.map(async (src) => {
          try {
            let cleaned = src.replace(/^\/+/, '');
            try {
              cleaned = decodeURI(cleaned);
            } catch {
              /* malformed escape — try as-is */
            }
            const bytes = await api.readPublicAsset(cleaned);
            const blob = new Blob([new Uint8Array(bytes)], {
              type: guessMime(cleaned),
            });
            const url = URL.createObjectURL(blob);
            newBlobUrls.push(url);
            map.set(src, url);
          } catch {
            /* leave src as-is — img will show broken */
          }
        }),
      );

      if (cancelled) {
        newBlobUrls.forEach((u) => URL.revokeObjectURL(u));
        return;
      }

      // Revoke previous batch only after the new HTML is committed
      const prev = blobUrlsRef.current;
      blobUrlsRef.current = newBlobUrls;
      setHtml(applySrcMap(sanitized, map));
      // Defer revoke so any in-flight <img> on the old html unmounts first
      requestAnimationFrame(() => {
        prev.forEach((u) => URL.revokeObjectURL(u));
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [content, blogPath]);

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  return (
    <article
      className="markdown-body h-full overflow-y-auto px-12 py-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
