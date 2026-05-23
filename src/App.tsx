import { useEffect, useState, useCallback, useRef } from 'react';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import { api } from '@/lib/tauri';
import { formatDraft } from '@/lib/formatDraft';
import { Toolbar } from '@/components/Toolbar';
import { Sidebar } from '@/components/Sidebar';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { LogDrawer } from '@/components/LogDrawer';
import { NewArticleDialog } from '@/components/NewArticleDialog';
import { RenameDialog } from '@/components/RenameDialog';
import type {
  ArticleSummary,
  ArticleDetail,
  PageSummary,
  PublishLogEntry,
  Tab,
  DocumentKind,
} from '@/types';

declare global {
  interface Window {
    __editorInsert?: (text: string) => void;
  }
}

export default function App() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [current, setCurrent] = useState<ArticleDetail | null>(null);
  const [currentKind, setCurrentKind] = useState<DocumentKind>('article');
  const [editorValue, setEditorValue] = useState('');
  const [savedValue, setSavedValue] = useState('');
  const [tab, setTab] = useState<Tab>('write');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('就绪');
  const [logOpen, setLogOpen] = useState(false);
  const [logEntries, setLogEntries] = useState<PublishLogEntry[]>([]);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<ArticleSummary | null>(null);
  const [blogPath, setBlogPath] = useState('');

  const dirty = editorValue !== savedValue;
  const dirtyRef = useRef(dirty);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  const confirmDiscardIfDirty = useCallback(() => {
    if (!dirtyRef.current) return true;
    return confirm('当前文档尚未保存，确定切换吗？');
  }, []);

  const refreshArticles = useCallback(async () => {
    const list = await api.listArticles();
    setArticles(list);
  }, []);

  const refreshPages = useCallback(async () => {
    const list = await api.listPages();
    setPages(list);
  }, []);

  const openArticle = useCallback(
    async (relativePath: string) => {
      if (!confirmDiscardIfDirty()) return;
      const article = await api.readArticle(relativePath);
      setCurrent(article);
      setCurrentKind('article');
      setEditorValue(article.content);
      setSavedValue(article.content);
      setStatus('已载入');
    },
    [confirmDiscardIfDirty],
  );

  const openPage = useCallback(
    async (relativePath: string) => {
      if (!confirmDiscardIfDirty()) return;
      const page = await api.readPage(relativePath);
      setCurrent({
        relativePath: page.relativePath,
        filename: page.relativePath.split('/').pop() || '',
        title: page.title,
        content: page.content,
      });
      setCurrentKind('page');
      setEditorValue(page.content);
      setSavedValue(page.content);
      setStatus(`已载入页面：${page.label}`);
    },
    [confirmDiscardIfDirty],
  );

  useEffect(() => {
    (async () => {
      try {
        const cfg = await api.getConfig();
        setBlogPath(cfg.blogPath);
        const [list, pageList] = await Promise.all([
          api.listArticles(),
          api.listPages(),
        ]);
        setArticles(list);
        setPages(pageList);
        if (list[0]) {
          const first = await api.readArticle(list[0].relativePath);
          setCurrent(first);
          setCurrentKind('article');
          setEditorValue(first.content);
          setSavedValue(first.content);
        }
      } catch (e) {
        alert(String(e));
        setStatus('启动失败');
      }
    })();
  }, []);

  useEffect(() => {
    let unlisten: UnlistenFn | undefined;
    listen<PublishLogEntry>('publish-log', (event) => {
      setLogEntries((prev) => [...prev, event.payload]);
      setLogOpen(true);
    }).then((fn) => {
      unlisten = fn;
    });
    return () => {
      unlisten?.();
    };
  }, []);

  const currentSlug = () => {
    if (!current) return '';
    const name = current.relativePath.split('/').pop() || '';
    return name.replace(/\.md$/i, '');
  };

  const insertAtCursor = (text: string) => {
    window.__editorInsert?.(text);
  };

  const handlePasteImage = async (file: File) => {
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const md = await api.savePastedImage(bytes, currentSlug());
      insertAtCursor(md);
      setStatus('图片已插入');
    } catch (e) {
      alert(String(e));
      setStatus('插入图片失败');
    }
  };

  const handleDropImages = async (files: File[]) => {
    try {
      for (const file of files) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const md = await api.savePastedImage(bytes, currentSlug());
        insertAtCursor(md);
      }
      setStatus('图片已插入');
    } catch (e) {
      alert(String(e));
      setStatus('插入图片失败');
    }
  };

  const handleNew = () => setNewDialogOpen(true);

  const handleCreateSubmit = async (payload: {
    title: string;
    description?: string;
    tags?: string;
    category?: string;
  }) => {
    setNewDialogOpen(false);
    setBusy(true);
    try {
      const article = await api.createArticle(payload);
      setCurrent(article);
      setCurrentKind('article');
      setEditorValue(article.content);
      setSavedValue(article.content);
      setTab('write');
      await refreshArticles();
      setStatus('文章已创建');
    } catch (e) {
      alert(String(e));
      setStatus('创建失败');
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    if (!current) {
      setStatus('请先选择或新建文档');
      return;
    }
    try {
      if (currentKind === 'article') {
        const saved = await api.saveArticle({
          relativePath: current.relativePath,
          content: editorValue,
        });
        setCurrent({ ...current, title: saved.title });
        setSavedValue(editorValue);
        await refreshArticles();
        setStatus('草稿已保存');
      } else {
        const saved = await api.savePage({
          relativePath: current.relativePath,
          content: editorValue,
        });
        setCurrent({ ...current, title: saved.title });
        setSavedValue(editorValue);
        await refreshPages();
        setStatus('页面已保存（本地）');
      }
    } catch (e) {
      alert(String(e));
      setStatus('保存失败');
    }
  };

  const handleInsertImage = async () => {
    setBusy(true);
    try {
      const md = await api.saveClipboardImage(currentSlug());
      insertAtCursor(md);
      setStatus('图片已插入');
    } catch (e) {
      alert(String(e));
      setStatus('插入图片失败');
    } finally {
      setBusy(false);
    }
  };

  const handleFormat = () => {
    const after = formatDraft(editorValue);
    if (after === editorValue) {
      setStatus('已经是整理后的格式');
      return;
    }
    setEditorValue(after);
    setStatus('已整理草稿');
  };

  const handlePublish = async () => {
    if (!current) {
      setStatus('请先选择或新建文档');
      return;
    }
    setBusy(true);
    setLogOpen(true);
    setLogEntries([]);
    try {
      if (currentKind === 'article') {
        setLogEntries((p) => [
          ...p,
          { stream: 'cmd', text: '发布文章\n' },
        ]);
        await api.publish({
          relativePath: current.relativePath,
          content: editorValue,
          title: current.title,
        });
      } else {
        setLogEntries((p) => [
          ...p,
          { stream: 'cmd', text: '发布页面\n' },
        ]);
        await api.publishPage({
          relativePath: current.relativePath,
          content: editorValue,
          title: current.title,
        });
        await refreshPages();
      }
      setSavedValue(editorValue);
      if (currentKind === 'article') await refreshArticles();
      alert('发布成功');
      setStatus('发布成功');
    } catch (e) {
      setLogEntries((p) => [
        ...p,
        { stream: 'stderr', text: `${String(e)}\n` },
      ]);
      alert(`发布失败：${String(e)}`);
      setStatus('发布失败');
    } finally {
      setBusy(false);
    }
  };

  const handleRename = (article: ArticleSummary) => {
    setRenameTarget(article);
  };

  const handleRenameSubmit = async (newTitle: string) => {
    if (!renameTarget) return;
    const target = renameTarget;
    setRenameTarget(null);
    setBusy(true);
    setLogOpen(true);
    setLogEntries([]);
    try {
      const updated = await api.renameArticle({
        relativePath: target.relativePath,
        newTitle,
      });
      if (current?.relativePath === target.relativePath) {
        setCurrent(updated);
        setCurrentKind('article');
        setEditorValue(updated.content);
        setSavedValue(updated.content);
      }
      await refreshArticles();
      setStatus('文章已重命名并推送');
    } catch (e) {
      alert(`重命名失败：${String(e)}`);
      setStatus('重命名失败');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (article: ArticleSummary) => {
    const ok = confirm(
      `确定删除《${article.title}》？\n此操作会立即推送到远端，无法撤销。`,
    );
    if (!ok) return;
    setBusy(true);
    setLogOpen(true);
    setLogEntries([]);
    try {
      await api.deleteArticle(article.relativePath);
      if (current?.relativePath === article.relativePath) {
        setCurrent(null);
        setEditorValue('');
        setSavedValue('');
      }
      await refreshArticles();
      setStatus('文章已删除并推送');
    } catch (e) {
      alert(`删除失败：${String(e)}`);
      setStatus('删除失败');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        busy={busy}
        onNew={handleNew}
        onSave={handleSave}
        onPublish={handlePublish}
        onInsertImage={handleInsertImage}
        onFormat={handleFormat}
        onRefresh={async () => {
          await Promise.all([refreshArticles(), refreshPages()]);
          if (current) {
            if (currentKind === 'article') {
              const fresh = await api.readArticle(current.relativePath);
              setCurrent(fresh);
              setEditorValue(fresh.content);
              setSavedValue(fresh.content);
            } else {
              const fresh = await api.readPage(current.relativePath);
              setCurrent({
                relativePath: fresh.relativePath,
                filename: fresh.relativePath.split('/').pop() || '',
                title: fresh.title,
                content: fresh.content,
              });
              setEditorValue(fresh.content);
              setSavedValue(fresh.content);
            }
          }
        }}
      />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar
          articles={articles}
          pages={pages}
          currentPath={current?.relativePath ?? null}
          search={search}
          onSearchChange={setSearch}
          onSelect={openArticle}
          onSelectPage={openPage}
          onRename={handleRename}
          onDelete={handleDelete}
        />
        <section className="flex flex-1 flex-col overflow-hidden">
          <div className="flex h-9 items-center gap-1 border-b border-ink-200 px-3 dark:border-ink-500">
            <TabButton
              active={tab === 'write'}
              onClick={() => setTab('write')}
            >
              写作
            </TabButton>
            <TabButton
              active={tab === 'preview'}
              onClick={() => setTab('preview')}
            >
              预览
            </TabButton>
            <div className="ml-3 truncate text-xs text-ink-400">
              {current?.relativePath || ''}
              {currentKind === 'page' && current ? '（页面）' : ''}
              {dirty ? ' •' : ''}
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden bg-white dark:bg-ink-700">
            {tab === 'write' ? (
              <Editor
                value={editorValue}
                onChange={setEditorValue}
                onPasteImage={handlePasteImage}
                onDropImages={handleDropImages}
              />
            ) : (
              <Preview content={editorValue} blogPath={blogPath} />
            )}
          </div>
        </section>
      </main>
      <LogDrawer
        open={logOpen}
        status={status}
        entries={logEntries}
        onClose={() => setLogOpen(false)}
      />
      <NewArticleDialog
        open={newDialogOpen}
        onClose={() => setNewDialogOpen(false)}
        onSubmit={handleCreateSubmit}
      />
      <RenameDialog
        open={renameTarget !== null}
        initialTitle={renameTarget?.title ?? ''}
        onClose={() => setRenameTarget(null)}
        onSubmit={handleRenameSubmit}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'h-7 rounded-md px-3 text-sm transition',
        active
          ? 'bg-ink-100 dark:bg-ink-600'
          : 'text-ink-400 hover:bg-black/5 dark:hover:bg-white/5',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
