import type { ResolvedTheme, ThemeMode } from '@/lib/theme';

interface ToolbarProps {
  busy: boolean;
  onNew: () => void;
  onSave: () => void;
  onPublish: () => void;
  onInsertImage: () => void;
  onFormat: () => void;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  onThemeModeChange: (mode: ThemeMode) => void;
  onRefresh: () => void;
}

const ghost =
  'h-8 rounded-md px-3 text-sm text-ink-500 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:text-ink-100 dark:hover:bg-white/5';

const outline =
  'h-8 rounded-md border border-ink-200 px-3 text-sm transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-500 dark:hover:bg-ink-600';

const primary =
  'h-8 rounded-md px-3.5 text-sm font-medium text-white bg-accent transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 dark:bg-accent-dark dark:hover:bg-accent-darkHover';

const themeOptions: Array<{
  mode: ThemeMode;
  label: string;
  title: string;
}> = [
  { mode: 'system', label: '跟随', title: '跟随系统颜色' },
  { mode: 'light', label: '浅色', title: '使用浅色模式' },
  { mode: 'dark', label: '深色', title: '使用深色模式' },
];

export function Toolbar({
  busy,
  onNew,
  onSave,
  onPublish,
  onInsertImage,
  onFormat,
  themeMode,
  resolvedTheme,
  onThemeModeChange,
  onRefresh,
}: ToolbarProps) {
  return (
    <header className="flex h-12 items-center gap-1 border-b border-ink-200 bg-white/80 px-3 backdrop-blur dark:border-ink-500 dark:bg-ink-700/80">
      <button type="button" onClick={onNew} disabled={busy} className={ghost}>
        新建
      </button>
      <button type="button" onClick={onSave} disabled={busy} className={outline}>
        保存
      </button>
      <button type="button" onClick={onPublish} disabled={busy} className={primary}>
        发布
      </button>

      <span className="mx-2 h-5 w-px bg-ink-200 dark:bg-ink-500" />

      <button type="button" onClick={onInsertImage} disabled={busy} className={ghost}>
        插图
      </button>
      <button
        type="button"
        onClick={onFormat}
        disabled={busy}
        title="整理草稿：补 frontmatter、加图注占位、规范空行"
        className={ghost}
      >
        整理
      </button>

      <div className="flex-1" />

      <div
        className="flex h-8 shrink-0 items-center rounded-md border border-ink-200 bg-ink-50 p-0.5 dark:border-ink-500 dark:bg-ink-600"
        aria-label={`颜色模式，当前为${resolvedTheme === 'dark' ? '深色' : '浅色'}`}
      >
        {themeOptions.map((option) => (
          <button
            key={option.mode}
            type="button"
            title={option.title}
            aria-pressed={themeMode === option.mode}
            onClick={() => onThemeModeChange(option.mode)}
            className={[
              'h-7 min-w-11 rounded px-2 text-xs transition',
              themeMode === option.mode
                ? 'bg-white text-ink-700 shadow-soft dark:bg-ink-700 dark:text-ink-50 dark:shadow-none'
                : 'text-ink-400 hover:text-ink-700 dark:text-ink-300 dark:hover:text-ink-50',
            ].join(' ')}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button type="button" onClick={onRefresh} disabled={busy} className={ghost}>
        刷新
      </button>
    </header>
  );
}
