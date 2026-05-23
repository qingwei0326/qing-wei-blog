import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { convertFileSrc } from '@tauri-apps/api/core';

interface PreviewProps {
  content: string;
  blogPath: string;
}

function rewriteImages(html: string, blogPath: string): string {
  if (!blogPath) return html;
  const container = document.createElement('div');
  container.innerHTML = html;
  container.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (!src) return;
    if (/^([a-z]+:)?\/\//i.test(src) || src.startsWith('data:') || src.startsWith('asset:') || src.startsWith('http')) {
      return;
    }
    const cleaned = src.replace(/^\/+/, '');
    const absolute = `${blogPath.replace(/\\/g, '/')}/docs/public/${cleaned}`;
    img.setAttribute('src', convertFileSrc(absolute));
  });
  return container.innerHTML;
}

export function Preview({ content, blogPath }: PreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(marked.parse(content, { gfm: true, breaks: false })).then(
      (rendered) => {
        if (cancelled) return;
        setHtml(rewriteImages(rendered, blogPath));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [content, blogPath]);

  return (
    <article
      className="markdown-body h-full overflow-y-auto px-12 py-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
