import type { ArticleSummary, PageSummary } from '@/types';

interface SidebarProps {
  articles: ArticleSummary[];
  pages: PageSummary[];
  currentPath: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (relativePath: string) => void;
  onSelectPage: (relativePath: string) => void;
  onRename: (article: ArticleSummary) => void;
  onDelete: (article: ArticleSummary) => void;
}

export function Sidebar({
  articles,
  pages,
  currentPath,
  search,
  onSearchChange,
  onSelect,
  onSelectPage,
  onRename,
  onDelete,
}: SidebarProps) {
  const query = search.trim().toLowerCase();
  const filtered = query
    ? articles.filter((a) =>
        `${a.title} ${a.filename} ${a.date} ${a.description}`
          .toLowerCase()
          .includes(query),
      )
    : articles;

  return (
    <aside className="flex w-64 flex-col border-r border-ink-200 bg-ink-100 dark:border-ink-500 dark:bg-ink-600">
      <div className="p-3">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索文章"
          className="w-full rounded-md border border-ink-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-accent dark:border-ink-500 dark:bg-ink-700"
        />
      </div>

      {pages.length > 0 && (
        <div className="px-2 pb-1">
          <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
            页面
          </div>
          {pages.map((page) => {
            const active = currentPath === page.relativePath;
            return (
              <button
                key={page.relativePath}
                type="button"
                onClick={() => onSelectPage(page.relativePath)}
                className={[
                  'mb-1 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition',
                  active
                    ? 'bg-accent/10 dark:bg-accent-dark/20'
                    : 'hover:bg-black/5 dark:hover:bg-white/5',
                ].join(' ')}
              >
                <span className="truncate font-medium">{page.label}</span>
                <span className="ml-2 truncate text-xs text-ink-400">
                  {page.title}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
        文章
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {filtered.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-ink-400">
            {search ? '没有匹配的文章' : '暂无文章'}
          </div>
        ) : (
          filtered.map((article) => {
            const active = currentPath === article.relativePath;
            return (
              <div
                key={article.relativePath}
                className={[
                  'group relative mb-1 rounded-md transition',
                  active
                    ? 'bg-accent/10 dark:bg-accent-dark/20'
                    : 'hover:bg-black/5 dark:hover:bg-white/5',
                ].join(' ')}
              >
                <button
                  type="button"
                  onClick={() => onSelect(article.relativePath)}
                  className="block w-full rounded-md px-3 py-2 pr-14 text-left text-sm"
                >
                  <div className="truncate font-medium">{article.title}</div>
                  <div className="mt-0.5 truncate text-xs text-ink-400">
                    {article.date || article.filename}
                  </div>
                </button>
                <div className="absolute right-1 top-1/2 hidden -translate-y-1/2 gap-0.5 group-hover:flex">
                  <IconButton
                    title="重命名"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRename(article);
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </IconButton>
                  <IconButton
                    title="删除"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(article);
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  </IconButton>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded text-ink-400 transition hover:bg-black/10 hover:text-ink-700 dark:hover:bg-white/10 dark:hover:text-ink-100"
    >
      {children}
    </button>
  );
}
