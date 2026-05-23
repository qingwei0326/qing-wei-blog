import type { PublishLogEntry } from '@/types';

interface LogDrawerProps {
  open: boolean;
  status: string;
  entries: PublishLogEntry[];
  onClose: () => void;
}

export function LogDrawer({ open, status, entries, onClose }: LogDrawerProps) {
  if (!open) return null;
  return (
    <section className="border-t border-ink-200 bg-ink-700 text-green-400 dark:border-ink-500 dark:bg-black">
      <div className="flex items-center justify-between border-b border-ink-500 px-3 py-1.5 text-xs text-ink-100">
        <span>{status}</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-2 py-0.5 hover:bg-white/10"
        >
          关闭
        </button>
      </div>
      <pre className="m-0 max-h-48 overflow-y-auto px-3 py-2 font-mono text-xs leading-5">
        {entries.map((entry, i) => {
          const prefix = entry.stream === 'cmd' ? '$ ' : '';
          return (
            <span
              key={i}
              className={
                entry.stream === 'stderr'
                  ? 'text-red-400'
                  : entry.stream === 'cmd'
                    ? 'text-blue-300'
                    : undefined
              }
            >
              {prefix}
              {entry.text}
            </span>
          );
        })}
      </pre>
    </section>
  );
}
